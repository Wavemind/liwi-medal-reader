/**
 * The external imports
 */

/**
 * The internal imports
 */
import { store } from '@/Store'
import { Config } from '@/Config'
import { getYesAnswer } from '@/Utils/Answers'

export default () => {
  const getValidDiagnostics = (diagnostics, mcNodes, nodes) => {
    return Object.values(diagnostics).filter(
      diagnostic =>
        mcNodes[diagnostic.complaint_category].answer ===
        getYesAnswer(nodes[diagnostic.complaint_category]).id,
      // Handle des cutoffs
    )
  }

  const getTopConditions = instances => {
    return Object.values(instances).filter(
      instance =>
        instance.conditions.length === 0 &&
        instance.final_diagnostic_id === null,
    )
  }

  const orderSystems = (systemOrder, questionsPerSystem) => {
    const orderedSystem = []
    systemOrder.forEach(system => {
      if (
        questionsPerSystem[system.title] &&
        questionsPerSystem[system.title].length > 0
      ) {
        orderedSystem.push({
          title: system.title,
          data: uniq(system.data).filter(data =>
            questionsPerSystem[system.title].includes(data),
          ),
        })
      }
    })
    return orderedSystem
  }

  const addQuestionToSystem = (questionId, questionPerSystems, nodes) => {
    if (medicalHistoryCategories.includes(nodes[questionId].category)) {
      if (nodes[questionId].system in questionPerSystems) {
        questionPerSystems[nodes[questionId].system].push(questionId)
      } else {
        questionPerSystems[nodes[questionId].system] = [questionId]
      }
    }
  }

  /**
   * Set is the most effective way : https://stackoverflow.com/questions/26097132/javascript-remove-duplicates-algorithm-efficiency
   */
  const uniq = array => {
    return [...new Set(array)]
  }

  const calculateCondition = instance => {
    const state = store.getState()
    const mcNodes = state.medicalCase.item.nodes
    const nodes = state.algorithm.item.nodes

    return instance.conditions.some(condition => {
      if (instance.id === 88) {
        console.log('condition', mcNodes, mcNodes[condition.node_id], condition)
      }
      return (
        mcNodes[condition.node_id].answer === condition.answer_id ||
        nodes[condition.node_id].category ===
          Config.CATEGORIES.backgroundCalculation
      )
    })
  }

  const handleChildren = (children, questionPerSystems, nodes, diagnostic) => {
    if (diagnostic.id === 20) {
      console.log(children)
    }
    children.forEach(instance => {
      if (diagnostic.id === 20 && instance.id === 88) {
        console.log(
          'Ici',
          instance,
          instance.conditions.length === 0,
          calculateCondition(instance),
        )
      }
      if (
        instance.conditions.length === 0 ||
        calculateCondition(instance) ||
        nodes[instance.id].category === Config.CATEGORIES.backgroundCalculation // C'est pour faire semblant que les BC sont répondues
      ) {
        addQuestionToSystem(instance.id, questionPerSystems, nodes)
        const childrenInstance = instance.children
          .filter(
            child => nodes[child].type !== Config.NODE_TYPES.finalDiagnostic,
          )
          .map(child => diagnostic.instances[child])
        if (childrenInstance.length > 0) {
          handleChildren(
            childrenInstance,
            questionPerSystems,
            nodes,
            diagnostic,
          )
        }
      }
    })
  }

  const state = store.getState()
  const medicalHistoryCategories = [
    Config.CATEGORIES.symptom,
    Config.CATEGORIES.exposure,
    Config.CATEGORIES.chronicCondition,
    Config.CATEGORIES.symptom,
    Config.CATEGORIES.vaccine,
    Config.CATEGORIES.observedPhysicalSign,
    //Config.CATEGORIES.backgroundCalculation,
  ]
  const diagnostics = state.algorithm.item.diagnostics
  const nodes = state.algorithm.item.nodes
  const mcNodes = state.medicalCase.item.nodes
  const questionPerSystems = {}
  const medicalHistoryStep =
    state.algorithm.item.config.full_order.medical_history_step

  const validDiagnostics = getValidDiagnostics(diagnostics, mcNodes, nodes)

  console.log('validDiagnostics', validDiagnostics)
  console.log('nodes', nodes)

  validDiagnostics.forEach(diagnostic => {
    const topConditions = getTopConditions(diagnostic.instances)

    handleChildren(topConditions, questionPerSystems, nodes, diagnostic)
  })
  Object.keys(questionPerSystems).map(k => {
    questionPerSystems[k] = uniq(questionPerSystems[k])
  })
  console.log('systems', questionPerSystems)
  console.log('medicalHistoryStep', medicalHistoryStep)

  return orderSystems(medicalHistoryStep, questionPerSystems)
}
