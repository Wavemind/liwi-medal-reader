/**
 * The external imports
 */
import reduce from 'lodash/reduce'
import differenceInDays from 'date-fns/differenceInDays'

/**
 * The internal imports
 */
import { getNoAnswer, getYesAnswer } from '@/Utils/Answers'
import { store } from '@/Store'
import { Config } from '@/Config'

/**
 * Will go through all the diagnoses of the algorithm and will return those that are still
 * valid based on the selected complain categories and the birth date(cut off)
 * @returns {Array<Diagnoses>} : List of valid diagnoses
 */
export const getValidDiagnoses = () => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  const mcNodes = state.medicalCase.item.nodes
  const diagnoses = state.algorithm.item.diagnoses

  return Object.values(diagnoses).filter(diagnosis => {
    return (
      mcNodes[diagnosis.complaint_category].answer ===
        getYesAnswer(nodes[diagnosis.complaint_category]).id &&
      respectsCutOff(diagnosis.cut_off_start, diagnosis.cut_off_end)
    )
  })
}

/**
 * Tells if a cut off is respected based on patients birth date and the medical case creation date
 * @param { Timestamp | null } cut_off_start : Lower threshold
 * @param { Timestamp | null } cut_off_end : Higher threshold
 * @returns { Boolean }
 */
export const respectsCutOff = (cut_off_start, cut_off_end) => {
  const state = store.getState()
  const birthDate = state.patient.item.birth_date
  const createdAt = state.medicalCase.item.createdAt

  const ageInDays = differenceInDays(new Date(createdAt), new Date(birthDate))

  // If there is no cut off defined
  if (
    (cut_off_start === null && cut_off_end === null) ||
    (cut_off_start === undefined && cut_off_end === undefined)
  ) {
    return true
  }

  // If there is only a end cut off
  if (cut_off_start === null || cut_off_start === undefined) {
    return cut_off_end > ageInDays
  }

  // If there is only a start cut off
  if (cut_off_end === null || cut_off_end === undefined) {
    return cut_off_start <= ageInDays
  } else {
    return cut_off_start <= ageInDays && cut_off_end > ageInDays
  }
}

/**
 * Returns the nodes without condition of a diagnosis or a question sequence
 * @param {Array<Instance>} instances : instances from the diagram we are handling
 * @returns {Array<Instance>} Instances without conditions
 */
export const getTopConditions = (instances, isFinalDiagnosis = false) => {
  return Object.values(instances).filter(
    instance =>
      instance.conditions.length === 0 &&
      (isFinalDiagnosis || instance.final_diagnosis_id === null),
  )
}

/**
 * Recursive function that goes through the diagram and add the valid node in questionsToDisplay
 * @param {Array<Instance>} children : The instance we want to process
 * @param {object | Array<Integer>} questionsToDisplay : reference to the node we want to show in the view
 * @param {Array<Instance>} instances : all the instances in the diagram we are processing
 * @param {Array<String>} categories : The node categories we want to add to questionsToDisplay
 * @param {Integer} diagramId : The id of the diagram we are processing
 * @param {String} diagramType : The kind of diagram we are processing Either Question Sequence or Diagnosis
 * @param {Boolean} system : tells if we need to split into systems
 */
export const handleChildren = (
  children,
  source,
  questionsToDisplay,
  instances,
  categories,
  diagramId,
  diagramType,
  system,
  currentSystems,
  systemOrder,
) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  children.forEach(instance => {
    if (
      (!excludedByCC(instance.id) && instance.conditions.length === 0) ||
      calculateCondition(instance, source)
    ) {
      if (nodes[instance.id].type === Config.NODE_TYPES.questionsSequence) {
        const topConditions = getTopConditions(nodes[instance.id].instances)
        handleChildren(
          topConditions,
          instance.id,
          questionsToDisplay,
          nodes[instance.id].instances,
          categories,
          instance.id,
          Config.NODE_TYPES.questionsSequence,
          system,
          currentSystems,
          systemOrder,
        )
      } else {
        if (system) {
          addQuestionToSystem(
            instance.id,
            questionsToDisplay,
            categories,
            currentSystems,
            systemOrder,
          )
        } else {
          addQuestion(instance.id, questionsToDisplay, categories)
        }
      }

      const healthcareCategories = [
        Config.CATEGORIES.drug,
        Config.CATEGORIES.management,
      ]

      const childrenInstance = instance.children
        .filter(
          childId =>
            ((nodes[childId].type !== Config.NODE_TYPES.finalDiagnosis &&
              diagramType === Config.NODE_TYPES.diagnosis) ||
              (diagramType === Config.NODE_TYPES.questionsSequence &&
                childId !== diagramId && [Config.CATEGORIES.drug])) &&
            !healthcareCategories.includes(nodes[childId].category),
        )
        .map(childId => instances[childId])
      if (childrenInstance.length > 0) {
        handleChildren(
          childrenInstance,
          instance.id,
          questionsToDisplay,
          instances,
          categories,
          diagramId,
          diagramType,
          system,
          currentSystems,
          systemOrder,
        )
      }
    }
  })
}

/**
 * Adds a node to questionsToDisplay by system if it is in a category defined in categories
 * @param {Integer} questionId : Question we want to add in questionsToDisplay
 * @param {object} questionsToDisplay : Object of question id to display filtered by system
 * @param {Array<String>} categories : The categories we want to add in questionsToDisplay
 */
const addQuestionToSystem = (
  questionId,
  questionsToDisplay,
  categories,
  currentSystems,
  systemOrder,
) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  const mcNodes = state.medicalCase.item.nodes

  const lastSystemUpdated = state.medicalCase.item.lastSystemUpdated

  if (categories.includes(nodes[questionId].category)) {
    const oldSystemIndex = systemOrder.findIndex(
      system => system.title === lastSystemUpdated?.system,
    )

    const currentQuestionSystemIndex = systemOrder.findIndex(
      system => system.title === nodes[questionId].system,
    )
    const visibleNodes = Object.values(currentSystems)
      .map(system => system)
      .flat()
    const isAlreadyDisplayed = visibleNodes.includes(questionId)
    const isNodesAlreadyAnswered = visibleNodes.some(
      nodeId => mcNodes[nodeId].answer !== null || mcNodes[nodeId].value !== '',
    )

    if (
      (!isAlreadyDisplayed &&
        isNodesAlreadyAnswered &&
        currentQuestionSystemIndex < oldSystemIndex) ||
      currentSystems?.follow_up_questions?.includes(questionId)
    ) {
      if ('follow_up_questions' in questionsToDisplay) {
        questionsToDisplay.follow_up_questions.push(questionId)
      } else {
        questionsToDisplay.follow_up_questions = [questionId]
      }
    } else {
      if (nodes[questionId].system in questionsToDisplay) {
        questionsToDisplay[nodes[questionId].system].push(questionId)
      } else {
        questionsToDisplay[nodes[questionId].system] = [questionId]
      }
    }
  }
}

/**
 * Adds a node to questionsToDisplay if it is in a category defined in categories
 * @param {Integer} questionId : Question we want to add in questionsToDisplay
 * @param {object} questionsToDisplay : Array of question id to display
 * @param {Array<String>} categories : The categories we want to add in questionsToDisplay
 */
const addQuestion = (questionId, questionsToDisplay, categories) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  if (categories.includes(nodes[questionId].category)) {
    questionsToDisplay.push(questionId)
  }
}

/**
 * Tells if a node is excluded by a complaint category
 * @param {Integer} questionId : the id of the node we are testing
 * @returns {Boolean} Tells if node is excluded
 */
export const excludedByCC = questionId => {
  const state = store.getState()
  const mcNodes = state.medicalCase.item.nodes
  const nodes = state.algorithm.item.nodes
  if (
    nodes[questionId].type === Config.NODE_TYPES.finalDiagnosis ||
    nodes[questionId].category === Config.CATEGORIES.drug ||
    nodes[questionId].category === Config.CATEGORIES.management
  ) {
    return false
  }
  return nodes[questionId].conditioned_by_cc.some(
    ccId => mcNodes[ccId].answer === getNoAnswer(nodes[ccId]).id,
  )
}

/**
 * For an instance we will calculate its conditions
 * @param {Instance} instance : the instance we wanna calculate
 * @param {Integer} sourceId : the parent node id who called the function
 * @param {Nodes} newNodes : the nodes updated in the setAnswer process
 * @returns {Boolean} : value of the condition
 */
export const calculateCondition = (
  instance,
  sourceId = null,
  newNodes = {},
) => {
  const state = store.getState()
  const mcNodes = { ...state.medicalCase.item.nodes, ...newNodes }

  if (excludedByCC(instance.id)) {
    return false
  }
  if (instance.conditions.length === 0) {
    return true
  }

  return instance.conditions
    .filter(condition => {
      if (sourceId === null) {
        return true
      }
      return condition.node_id === sourceId
    })
    .some(
      condition =>
        mcNodes[condition.node_id].answer === condition.answer_id &&
        respectsCutOff(condition.cut_off_start, condition.cut_off_end),
    )
}

/**
 * Take an array of boolean and reduces it
 * @param {Array<Boolean>} conditionsValues : Array of boolean to reduce
 * @returns {Boolean} the reduced value
 */
export const reduceConditions = conditionsValues =>
  reduce(
    conditionsValues,
    (result, value) => {
      return comparingBooleanOr(result, value)
    },
    false,
  )

/**
 * Get the condition for an element at the bottom of a diagram final diagnosis / Question sequence
 * @param {Integer} nodeId : the node we want to test
 * @param {instance} mcNodes: the parent we are calling from
 * @param {Array<mcNode>} mcNodes: current medical case state
 * @returns
 */
export const diagramConditionsValues = (nodeId, instance, mcNodes) => {
  const nodes = store.getState().algorithm.item.nodes

  return nodes[nodeId].conditions
    .filter(condition => condition.node_id === instance.id)
    .map(condition => {
      if (mcNodes[condition.node_id].answer === null) {
        return null
      } else {
        return (
          mcNodes[condition.node_id].answer === condition.answer_id &&
          respectsCutOff(condition.cut_off_start, condition.cut_off_end)
        )
      }
    })
}

/**
 * Calculate node from bottom to top for version diagram
 * @param {Instances} conditions,
 * @param {Instances} mcNodes,
 * @returns true/false
 */
export const calculateConditionInverse = (conditions, mcNodes) => {
  const state = store.getState()
  const instances = state.algorithm.item.diagram.instances
  if (conditions === undefined || conditions.length === 0) {
    return true
  }

  return conditions.some(condition => {
    const conditionValue =
      mcNodes[condition.node_id].answer === condition.answer_id &&
      respectsCutOff(condition.cut_off_start, condition.cut_off_end)
    if (conditionValue) {
      return calculateConditionInverse(
        instances[condition.node_id].conditions,
        mcNodes,
      )
    } else {
      return false
    }
  })
}

/**
 * Calculate node from bottom to top for a final diagnosis
 * @param {Instances} conditions,
 * @param {Instances} mcNodes,
 * @returns true/false
 */
export const calculateConditionInverseFinalDiagnosis = (
  conditions,
  mcNodes,
  instances,
) => {
  if (conditions === undefined || conditions.length === 0) {
    return true
  }

  return conditions.some(condition => {
    const conditionValue =
      mcNodes[condition.node_id].answer === condition.answer_id &&
      respectsCutOff(condition.cut_off_start, condition.cut_off_end)
    if (conditionValue) {
      return calculateConditionInverseFinalDiagnosis(
        instances[condition.node_id].conditions,
        mcNodes,
        instances,
      )
    } else {
      return false
    }
  })
}

/**
 * Show in the console where in what diagram a node need to be shown
 * @param {Integer} nodeId : Node Id we wanna have info on
 * @param {Array<Node>} mcNodes : Current state of medical case nodes
 */
export const debugNode = (nodeId, mcNodes) => {
  const localMcNode =
    mcNodes === undefined ? store.getState().medicalCase.item.nodes : mcNodes
  const nodes = store.getState().algorithm.item.nodes
  const result = nodes[nodeId].dd.map(diagnosisId => {
    return {
      [diagnosisId]: debugNodeInDiagnosis(diagnosisId, nodeId, localMcNode),
    }
  })

  console.info(
    'debug',
    nodeId,
    result,
    nodes[nodeId],
    'answer' + ' ' + localMcNode[nodeId].answer,
    'value' + ' ' + localMcNode[nodeId].value,
  )
}

/**
 * Calculate the value of a node in a specific diagnosis
 * @param {Integer} diagnosisId : Id of the diagnosis
 * @param {Integer} nodeId : id of the node
 * @param {Array<Node>} mcNodes : Current state of the medical Case nodes
 * @returns {Boolean}
 */
const debugNodeInDiagnosis = (diagnosisId, nodeId, mcNodes) => {
  const validDiagnosesIds = getValidDiagnoses().map(diagnosis => diagnosis.id)
  const state = store.getState()
  const diagnoses = state.algorithm.item.diagnoses

  if (!validDiagnosesIds.includes(diagnosisId)) {
    return false
  }
  if (excludedByCC(nodeId)) {
    return false
  }
  if (diagnoses[diagnosisId].instances[nodeId].conditions.length === 0) {
    return true
  }
  return debugCalculateCondition(
    diagnosisId,
    diagnoses[diagnosisId].instances[nodeId].conditions,
    mcNodes,
  )
}

/**
 * Calculate the value for a specific instance in a diagram.
 * @param {Integer} diagnosisId : Id of the diagnosis
 * @param {Array<Condition>} conditions : conditions of the current node
 * @param {Array<Node>} mcNodes : Current state of the medical Case nodes
 * @returns
 */
const debugCalculateCondition = (diagnosisId, conditions, mcNodes) => {
  const state = store.getState()
  const diagnoses = state.algorithm.item.diagnoses

  if (conditions.length === 0) {
    return true
  }

  return conditions.some(condition => {
    const conditionValue =
      mcNodes[condition.node_id].answer === condition.answer_id
    if (conditionValue) {
      return debugCalculateCondition(
        diagnosisId,
        diagnoses[diagnosisId].instances[condition.node_id].conditions,
        mcNodes,
      )
    } else {
      return false
    }
  })
}

/**
  * Return value from both booleans
        | True | False | Null
  ____________________________
  True  | True | True  | True
  ____________________________
  False | True | False | Null
  ____________________________
  Null  | True | Null  | Null
  *
  * @params [Boolean] firstBoolean [Boolean] secondBoolean
  * @return [Boolean]
  *
  */
export const comparingBooleanOr = (firstBoolean, secondBoolean) => {
  if (firstBoolean === true || secondBoolean === true) {
    return true
  }
  if (firstBoolean === false && secondBoolean === false) {
    return false
  }
  if (firstBoolean === null || secondBoolean === null) {
    return null
  }
}

/**
 * Set is the most effective way : https://stackoverflow.com/questions/26097132/javascript-remove-duplicates-algorithm-efficiency
 */
export const uniq = array => {
  return [...new Set(array)]
}

/**
 * Transforms the patientValues into a usable format
 * @returns {*}
 */
export const transformPatientValues = () => {
  const patientValues = store.getState().patient.item.patientValues

  return patientValues.map(patientValue => {
    if (patientValue.answer_id === null) {
      return {
        nodeId: patientValue.node_id,
        field: 'value',
        value: patientValue.value,
      }
    }
    return {
      nodeId: patientValue.node_id,
      field: 'answer',
      value: patientValue.answer_id,
    }
  })
}

/**
 * Checks whether the medicalCase is locked by another device
 * @param medicalCase
 * @returns {boolean}
 */
export const isLocked = medicalCase => {
  const state = store.getState()
  const isConnected = state.network.isConnected
  const architecture = state.healthFacility.item.architecture

  return (
    isConnected &&
    architecture === 'client_server' &&
    medicalCase.closedAt === 0 &&
    !(
      String(medicalCase.device_id) === state.auth.item.deviceId ||
      medicalCase.device_id === null
    )
  )
}
