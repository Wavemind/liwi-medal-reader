import { Action, ReducerClass } from 'reducer-class';

import { REHYDRATE } from 'redux-persist';
import { filter } from 'lodash';
import 'reflect-metadata';

import { actions } from '../../actions/types.actions';
import { categories } from '../../constants';
import { newDrugsFilter } from '../../algorithm/treeDiagnosis.algo';
import { nodeUpdateAnswer } from '../../helpers/Node.model';
import NavigationService from '../../../src/engine/navigation/Navigation.service';
import { processUpdatedNode } from '../../algorithm/epics.algo';

export const initialState = { modal: { open: false, content: '', navigator: {}, params: {} } };

/**
 * Reducer
 * Catch actions from redux / dispatcher
 * Load MedicalCase on it
 * */
class MedicalCaseReducer extends ReducerClass {
  initialState = {};

  // --------------------------       Actions        --------------------------
  // --------------------------------------------------------------------------
  /**
   * Sets the consent file in the patient after scanning it, the consent in the
   * medical case is set to true
   * @payload page : the scanned file in a base64 format
   */
  @Action(actions.ADD_CONSENT_FILE)
  addConsentFile(state, action) {
    const { page } = action.payload;

    return {
      ...state,
      consent: true,
      patient: {
        ...state.patient,
        consent_file: page,
      },
    };
  }

  /**
   * Update property of the list of diagnoses
   *
   * @payload type: type of diagnoses ()
   *    proposed: [], // Retaind by algo
   *    custom: [], // Add by the input
   *    additional: [] // Add even though it's false
   * @payload diagnoses: Diagnoses
   * @payload actionDiagnoses: Specific action to avoid multiple different action
   */
  @Action(actions.SET_DIAGNOSES)
  updateDiagnoses(state, action) {
    const { type, diagnoses, actionDiagnoses } = action.payload;
    let newDiagnoses;
    let newadditionnalDrugs;

    // Depending of type
    switch (type) {
      case 'proposed':
        // Add section
        if (actionDiagnoses === undefined || actionDiagnoses === 'add') {
          newDiagnoses = { ...state.diagnoses[type], [diagnoses.id]: { ...diagnoses } };
          newadditionnalDrugs = newDrugsFilter(newDiagnoses, state.diagnoses.additionalDrugs);

          return {
            ...state,
            diagnoses: {
              ...state.diagnoses,
              [type]: { ...newDiagnoses },
              additionalDrugs: { ...newadditionnalDrugs },
            },
          };
        }
        if (actionDiagnoses === 'remove') {
          const { [diagnoses.id]: diagnose, ...without } = state.diagnoses[type];
          return {
            ...state,
            diagnoses: {
              ...state.diagnoses,
              [type]: { ...without },
            },
          };
        }
        break;
      case 'additional':
        if (actionDiagnoses === undefined || actionDiagnoses === 'add') {
          newDiagnoses = { ...diagnoses };
          newadditionnalDrugs = newDrugsFilter(newDiagnoses, state.diagnoses.additionalDrugs);

          return {
            ...state,
            diagnoses: {
              ...state.diagnoses,
              [type]: { ...newDiagnoses },
              additionalDrugs: { ...newadditionnalDrugs },
            },
          };
        }
        if (actionDiagnoses === 'remove') {
          const { [diagnoses.id]: diagnose, ...without } = state.diagnoses[type];
          return {
            ...state,
            diagnoses: {
              ...state.diagnoses,
              [type]: { ...without },
            },
          };
        }
        break;
      case 'custom':
        let newArray = state.diagnoses[type].slice();
        let finder = newArray.find((d) => d.label === diagnoses.label);

        if (finder === undefined) {
          newArray.push(diagnoses);
        } else if (actionDiagnoses === 'remove') {
          newArray = newArray.filter((item) => item.label !== diagnoses.label);
        } else {
          finder = diagnoses;
        }

        return {
          ...state,
          diagnoses: {
            ...state.diagnoses,
            [type]: [...newArray],
          },
        };
    }
    return { ...state };
  }

  /**
   * Update property of medicalCase
   * @payload property: Index in Object
   * @payload newValue: New value of this index
   */
  @Action(actions.UPDATE_MEDICAL_CASE)
  updateMedicalCase(state, action) {
    const { property, newValue } = action.payload;
    return {
      ...state,
      [property]: newValue,
      json: null,
      patient: {
        ...state.patient,
        medicalCases: [],
      },
    };
  }

  /**
   * Update modal
   * @payload content: Text that will be shown in modal
   */
  @Action(actions.MC_UPDATE_MODAL)
  updateModalFromRedux(state, action) {
    const { params, type } = action.payload;

    const newModal = {
      open: state?.modal?.open === undefined ? true : !state.modal.open,
      params,
      type,
    };

    return {
      ...state,
      modal: newModal,
    };
  }

  /**
   * Set formulation for a drug
   * @payload diagnoseId
   * @payload drugId: the drugId
   * @payload type: key in diagnoses
   * @payload formulation: string formulation
   */
  @Action(actions.SET_FORMULATION_SELECTED)
  setFormulationSelected(state, action) {
    const { type, diagnoseId, formulation, drugId } = action.payload;

    let dataReturned = {};

    if (type === 'additionalDrugs') {
      dataReturned = {
        ...state.diagnoses[type],
        [drugId]: {
          ...state.diagnoses[type][drugId],
          formulationSelected: formulation,
        },
      };
    } else {
      dataReturned = {
        ...state.diagnoses[type],
        [diagnoseId]: {
          ...state.diagnoses[type][diagnoseId],
          drugs: {
            ...state.diagnoses[type][diagnoseId].drugs,
            [drugId]: {
              ...state.diagnoses[type][diagnoseId].drugs[drugId],
              formulationSelected: formulation,
            },
          },
        },
      };
    }

    return {
      ...state,
      diagnoses: {
        ...state.diagnoses,
        [type]: { ...dataReturned },
      },
    };
  }

  /**
   * Update custom medicine
   *
   * @payload diagnosesKey: the diagnosey identifiant
   * @payload medicine: the medicine
   * @payload type: add or remove (less action)
   */
  @Action(actions.SET_CUSTOM_MEDICINE)
  setCustomMedicine(state, action) {
    const { diagnosesKey, medicine, type } = action.payload;

    if (type === 'add') {
      state.diagnoses.custom[diagnosesKey].drugs.push(medicine);
    } else if (type === 'remove') {
      state.diagnoses.custom[diagnosesKey].drugs = state.diagnoses.custom[diagnosesKey].drugs.filter((e) => e !== medicine);
    }

    return {
      ...state,
      diagnoses: {
        ...state.diagnoses,
        custom: [...state.diagnoses.custom],
      },
    };
  }

  /**
   * Update medicine
   *
   * @payload type: additional or proposed
   * @payload diagnosesKey: diagnose id
   * @payload medicineId: medicine id
   * @payload boolean: add / remove medicine
   */
  @Action(actions.SET_MEDICINE)
  setMedicine(state, action) {
    const { finalDiagnosticId, diagnoseKey, medicineId, boolean, healthCareType } = action.payload;

    let newAdditionalDrugs = state.diagnoses.additionalDrugs;
    if (state.diagnoses.additionalDrugs[medicineId] !== undefined) {
      // Remove from additionnal
      const { [medicineId]: dontwant, ...other } = state.diagnoses.additionalDrugs;
      newAdditionalDrugs = other;
    }

    return {
      ...state,
      diagnoses: {
        ...state.diagnoses,
        additionalDrugs: { ...newAdditionalDrugs },
        [finalDiagnosticId]: {
          ...state.diagnoses[finalDiagnosticId],
          [diagnoseKey]: {
            ...state.diagnoses[finalDiagnosticId][diagnoseKey],
            [healthCareType]: {
              ...state.diagnoses[finalDiagnosticId][diagnoseKey][healthCareType],
              [medicineId]: {
                ...state.diagnoses[finalDiagnosticId][diagnoseKey][healthCareType][medicineId],
                agreed: boolean,
              },
            },
          },
        },
      },
    };
  }

  /**
   * Update medicine
   * @payload type: Text that will be shown in modal
   * @payload diagnosesKey: the diagnosey identifiant
   * @payload medicineId: the medecin identifiant
   * @payload boolean: the agreed / unagree value
   */
  @Action(actions.SET_ADDITIONAL_MEDICINE)
  setAdditionalMedicine(state, action) {
    const { medicines } = action.payload;

    return {
      ...state,
      diagnoses: {
        ...state.diagnoses,
        additionalDrugs: {
          ...medicines,
        },
      },
    };
  }

  /**
   * Update medicine
   * @payload type: Text that will be shown in modal
   * @payload diagnosesKey: the diagnosey identifiant
   * @payload medicineId: the medecin identifiant
   * @payload boolean: the agreed / unagree value
   */
  @Action(actions.SET_ADDITIONAL_MANAGEMENT)
  setAdditionalManagement(state, action) {
    const { management } = action.payload;

    return {
      ...state,
      diagnoses: {
        ...state.diagnoses,
        additionalManagements: {
          ...management,
        },
      },
    };
  }

  /**
   * Update medicine duration
   * @payload id: id of the medicine
   * @payload duration: the new value to update
   */
  @Action(actions.SET_ADDITIONAl_MEDICINE_DURATION)
  setAdditionalMedicineDuration(state, action) {
    const { id, duration } = action.payload;

    return {
      ...state,
      diagnoses: {
        ...state.diagnoses,
        additionalDrugs: {
          ...state.diagnoses.additionalDrugs,
          [id]: {
            ...state.diagnoses.additionalDrugs[id],
            duration,
          },
        },
      },
    };
  }

  /**
   * Sets / calculate the answer in the state
   *
   * @trigger When a question is answered
   * @payload index : Question id
   * @payload value : Answer value
   *                    if numeric question setted value
   *                    if other question answer id
   */
  @Action(actions.SET_ANSWER)
  setAnswer(state, action) {
    const { algorithm, nodeId, newValue } = action.payload;
    // Instantiate new object with answered question with new answer value
    const { answer, answer_stage, value, validationMessage, validationType } = nodeUpdateAnswer(newValue, algorithm, state.nodes[nodeId]);

    const medicalCase = JSON.parse(
      JSON.stringify({
        ...state,
        nodes: {
          ...state.nodes,
          [nodeId]: {
            ...state.nodes[nodeId],
            answer,
            answer_stage,
            value,
            validationMessage,
            validationType,
          },
        },
      })
    );
    processUpdatedNode(algorithm, medicalCase, nodeId);

    // TODO: Error on dispatch in NavigationService. Have not found a solution to mock it
    // if (
    //   (nodeId === algorithm.mobile_config.left_top_question_id ||
    //     nodeId === algorithm.mobile_config.first_top_right_question_id ||
    //     nodeId === algorithm.mobile_config.second_top_right_question_id) &&
    //   process.env.node_ENV !== 'test'
    // ) {
    //   NavigationService.setParamsAge(algorithm);
    // }

    return {
      ...medicalCase,
      json: null,
      patient: {
        ...medicalCase.patient,
        medicalCases: [],
      },
    };
  }

  /**
   * Set estimable value for basic measurement question
   * @param state
   * @param action
   * @returns {{nodes: [NodeModel]}}
   */
  @Action(actions.SET_ESTIMABLE)
  setEstimable(state, action) {
    const { index, value } = action.payload;

    return {
      ...state,
      nodes: {
        ...state.nodes,
        [index]: {
          ...state.nodes[index],
          estimableValue: value,
        },
      },
    };
  }

  /**
   * Set patient value
   * @param state
   * @param action
   * @returns {{patientValues}}
   */
  @Action(actions.SET_PATIENT_VALUE)
  setPatientValue(state, action) {
    const { index, value } = action.payload;
    const { algorithm } = state;
    const question = algorithm.nodes[index];
    const { answer } = nodeUpdateAnswer(value, algorithm, question);

    if (answer === null && value === null) {
      return state;
    }

    // We retrieve all the patient values
    const nodes = filter(state.algorithm.nodes, (node) => [categories.demographic, categories.basicDemographic].includes(node.category));
    const patientValues = nodes.map((node) => {
      const patientValue = state.patientValues.find((pv) => pv.node_id === node.id);
      const newNode = patientValue !== undefined ? patientValue : { answer_id: null, node_id: node.id, value: null };

      // Set new value for patient value updated
      if (newNode.node_id === index) {
        newNode.answer_id = answer;
        newNode.value = value;
      }
      return newNode;
    });
    return {
      ...state,
      patientValues,
    };
  }

  /**
   * Set the Patient in state
   * @payload Patient: the patient to store
   */
  @Action(actions.SET_PATIENT)
  setPatient(state, action) {
    const { patient, algorithm } = action.payload;

    return {
      ...patient,
      algorithm,
    };
  }

  /**
   * Sets an question to unavailable
   *
   * @trigger When a checkbox is triggered
   * @payload index : Question id
   * @payload value : Answer id find in questions.answers
   *
   */
  @Action(actions.SET_ANSWER_TO_UNAVAILABLE)
  setAnswerUnavailable(state, action) {
    const { nodeId, value } = action.payload;

    return {
      ...state,
      nodes: {
        ...state.nodes,
        [nodeId]: {
          ...state.nodes[nodeId],
          answer: value,
          value: null,
        },
      },
    };
  }

  /**
   * Set unavailable value
   * @param state
   * @param action
   * @returns {{nodes}}
   */
  @Action(actions.SET_UNAVAILABLE)
  setUnavailable(state, action) {
    const { nodeId, value } = action.payload;

    return {
      ...state,
      nodes: {
        ...state.nodes,
        [nodeId]: {
          ...state.nodes[nodeId],
          unavailableValue: value,
        },
      },
    };
  }

  /**
   * Update the metadata in MC
   *
   * @payload screen: Main screen in MC (Triage...)
   * @payload view: step in screen (sub view of screen)
   * @payload value: Array of questions id
   */
  @Action(actions.MC_UPDATE_METADATA)
  updateMetaData(state, action) {
    const { screen, view, value } = action.payload;

    return {
      ...state,
      metaData: {
        ...state.metaData,
        [screen]: {
          ...state.metaData[screen],
          [view]: value,
        },
      },
    };
  }

  /**
   * Update the patient value
   *
   * @payload index: property in object patient
   * @payload value: New value
   */
  @Action(actions.MC_UPDATE_PATIENT)
  updatePatient(state, action) {
    const { index, value } = action.payload;

    return {
      ...state,
      patient: {
        ...state.patient,
        [index]: value,
      },
    };
  }

  /**
   * Clear the medical case after close mc
   * store in localstorage if necessary
   *
   */
  @Action(actions.MC_CLEAR)
  medicalCaseClear() {
    return {
      ...initialState,
    };
  }

  /**
   * Set the medical case
   * store in localstorage if necessary
   * Instance the medical case with model
   *
   * @payload medicalCase: medical case
   */
  @Action(actions.MC_SET)
  medicalCaseSet(state, action) {
    const { medicalCase } = action.payload;

    return {
      ...medicalCase,
      json: null,
      patient: {
        ...medicalCase.patient,
        medicalCases: [],
      },
    };
  }

  /**
   * Method call from redux persist and re set the medical case
   *
   * @payload medicalCase: medical case
   */
  @Action(REHYDRATE)
  rehydrate(state, action) {
    if (action.payload === undefined || action.payload === null || action.payload.id === undefined || action.payload.id === null || action.payload.uid !== undefined) {
      return initialState;
    }

    const modelsMedicalCase = action.payload;

    modelsMedicalCase.modal.open = false;
    return {
      ...modelsMedicalCase,
      json: null,
      patient: {
        ...modelsMedicalCase.patient,
        medicalCases: [],
      },
    };
  }
}

export default MedicalCaseReducer.create();
