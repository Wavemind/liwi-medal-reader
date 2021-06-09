/**
 * The external imports
 */

/**
 * The internal imports
 */
import { store } from '@/Store'
import { Config } from '@/Config'
import { getYesAnswer } from '@/Utils/Answers'
import { Instagram } from 'node_modules/react-content-loader/dist/web/index'

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
          data: system.data.filter(data =>
            questionsPerSystem[system.title].includes(data),
          ),
        })
      }
    })
    return orderedSystem
  }

  const addQuestionToSystem = (questionId, questionPerSystems) => {
    if (nodes[questionId].system in questionPerSystems) {
      questionPerSystems[nodes[questionId].system].push(questionId)
    } else {
      questionPerSystems[nodes[questionId].system] = [questionId]
    }
  }

  const handleChildren = (children, questionPerSystems, nodes) => {
    children.forEach(instance => {
      if (medicalHistoryCategories.includes(nodes[instance.id].category)) {
        if (
          instance.conditions.length === 0 //||
          // instance.conditions === true || // Il faut faire une fonction pour tester la condition
          // nodes[instance.id].category ===
          // Config.CATEGORIES.backgroundCalculation // C'est pour faire semblance que les BC sont répondues
        ) {
          addQuestionToSystem(instance.id, questionPerSystems)
          // handleChildren(instance.children, questionPerSystems, nodes)
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

  // Get valid diagnostics
  const validDiagnostics = getValidDiagnostics(diagnostics, mcNodes, nodes)

  // validDiagnostics
  validDiagnostics.forEach(diagnostic => {
    const topConditions = getTopConditions(diagnostic.instances)

    handleChildren(topConditions, questionPerSystems, nodes)
  })
  console.log('systems', questionPerSystems)
  console.log('medicalHistoryStep', medicalHistoryStep)

  return orderSystems(medicalHistoryStep, questionPerSystems)
}
