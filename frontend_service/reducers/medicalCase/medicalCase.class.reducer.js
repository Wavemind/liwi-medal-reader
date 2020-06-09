import { Action, ReducerClass } from 'reducer-class';

import { REHYDRATE } from 'redux-persist';
import find from 'lodash/find';
import { filter } from 'lodash';
import { getItems, storeMedicalCase } from '../../../src/engine/api/LocalStorage';
import { actions } from '../../actions/types.actions';
import { categories, nodeTypes } from '../../constants';
import { DiagnosticModel } from '../../engine/models/Diagnostic.model';
import { NodesModel } from '../../engine/models/Nodes.model';
import 'reflect-metadata';
import { newDrugsFilter } from '../../algorithm/treeDiagnosis.algo';
import { QuestionModel } from '../../engine/models/Question.model';
import { PatientValueModel } from '../../engine/models/PatientValue.model';

export const initialState = { modal: { open: false, content: '', navigator: {}, params: {} } };

/**
 * Reducer
 * Catch actions from redux / dispatcher
 * Load MedicalCase on it
 * */
class MedicalCaseReducer extends ReducerClass {
  initialState = {};

  // The state is a MedicalCase
  // Instance it
  _instanceMedicalCase(state) {
    state = this._generateInstanceDiseasesNode(state);
    state.nodes = new NodesModel(state.nodes);
    return state;
  }

  // For the diseases we instance it
  _generateInstanceDiseasesNode(state) {
    Object.keys(state.diagnostics).forEach(
      (i) =>
        (state.diagnostics[i] = new DiagnosticModel({
          ...state.diagnostics[i],
        }))
    );

    return state;
  }

  // --------------------------       Actions        --------------------------
  // --------------------------------------------------------------------------

  /**
   * Update condition value of diagnostic or questions sequence for a question or a questions sequence
   *
   * @trigger When a condition value must be change
   * @payload nodeId: Question or QuestionsSequence
   * @payload callerId: Diagnostic or QuestionsSequence
   * @payload value: new condition value
   * @payload type: define if it's a diagnostic or a question sequence
   */
  @Action(actions.UPDATE_CONDITION_VALUE)
  updateConditionValue(state, action) {
    const { index, callerId, value, type } = action.payload;
    let caller;
    const newNode = {
      ...state.nodes[index],
    };

    switch (type) {
      case nodeTypes.diagnostic:
        caller = newNode.dd;
        break;
      case nodeTypes.questionsSequence:
        caller = newNode.qs;
        break;
    }

    const changeConditionValue = find(caller, (d) => d.id === callerId);

    // IF not the same condition update the node
    if (changeConditionValue.conditionValue !== value) {
      // Update counter condition Value
      // Explicite comparaison boolean for understand the case of new condition value
      if (value === true) {
        newNode.counter += 1;
      } else if (value === false) {
        newNode.counter -= 1;
      }
      changeConditionValue.conditionValue = value;
    }

    state.nodes[index] = state.nodes.instantiateNode({ ...newNode });

    return {
      ...state,
      nodes: new NodesModel(state.nodes),
    };
  }

  /**
   * Update property of the list of diagnoses
   *
   * @payload type: type of diagnoses ()
   *    proposed: [], // Retaind by algo
   custom: [], // Add by the input
   additional: [] // Add even though it's false
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
   *
   * @payload property: Index in Object
   * @payload newValue: New value of this index
   */
  @Action(actions.UPDATE_MEDICAL_CASE)
  updateMedicalCase(state, action) {
    const { property, newValue } = action.payload;

    return {
      ...state,
      [property]: newValue,
    };
  }

  /**
   * Update modal
   *
   * @payload content: Text that will be shown in modal
   */
  @Action(actions.MC_UPDATE_MODAL)
  updateModalFromRedux(state, action) {
    const { params, type } = action.payload;

    const newModal = {
      open: !state.modal.open,
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
   *
   * @payload diagnoseId: the diagnosey identifiant
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
   * Update custom medecine
   *
   * @payload diagnosesKey: the diagnosey identifiant
   * @payload medecine: the medecine
   * @payload type: add or remove (less action)
   */
  @Action(actions.SET_CUSTOM_MEDECINE)
  setCustomMedecine(state, action) {
    const { diagnosesKey, medecine, type } = action.payload;

    if (type === 'add') {
      state.diagnoses.custom[diagnosesKey].drugs.push(medecine);
    } else if (type === 'remove') {
      state.diagnoses.custom[diagnosesKey].drugs = state.diagnoses.custom[diagnosesKey].drugs.filter((e) => e !== medecine);
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
   * Update medecine
   *
   * @payload type: additional or proposed
   * @payload diagnosesKey: the diagnosey identifiant
   * @payload medecineId: the medecin identifiant
   * @payload boolean: the agreed / unagree value
   */
  @Action(actions.SET_MEDECINE)
  setMedecine(state, action) {
    const { type, diagnosesKey, medecineId, boolean } = action.payload;

    let newAdditionalDrugs = state.diagnoses.additionalDrugs;
    if (state.diagnoses.additionalDrugs[medecineId] !== undefined) {
      // Remove from additionnal
      const { [medecineId]: dontwant, ...other } = state.diagnoses.additionalDrugs;
      newAdditionalDrugs = other;
    }

    return {
      ...state,
      diagnoses: {
        ...state.diagnoses,
        additionalDrugs: { ...newAdditionalDrugs },
        [type]: {
          ...state.diagnoses[type],
          [diagnosesKey]: {
            ...state.diagnoses[type][diagnosesKey],
            drugs: {
              ...state.diagnoses[type][diagnosesKey].drugs,
              [medecineId]: {
                ...state.diagnoses[type][diagnosesKey].drugs[medecineId],
                agreed: boolean,
              },
            },
          },
        },
      },
    };
  }

  /**
   * Update medecine
   *
   * @payload type: Text that will be shown in modal
   * @payload diagnosesKey: the diagnosey identifiant
   * @payload medecineId: the medecin identifiant
   * @payload boolean: the agreed / unagree value
   */
  @Action(actions.SET_ADDITIONAL_MEDECINE)
  setAdditionalMedicine(state, action) {
    const { medecines } = action.payload;

    return {
      ...state,
      diagnoses: {
        ...state.diagnoses,
        additionalDrugs: {
          ...medecines,
        },
      },
    };
  }

  /**
   * Update medicine duration
   *
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
   * Set the answer for a specific PS
   *
   * @payload indexPs: Index of a specific PredefinedSydrome
   * @payload answer: New answer
   */
  @Action(actions.MC_PREDEFINED_SYNDROME_SET_ANSWER)
  psSetAnswer(state, action) {
    const { indexPs, answer } = action.payload;

    state.nodes[indexPs] = state.nodes.instantiateNode({
      ...state.nodes[indexPs],
      answer,
    });

    return {
      ...state,
      nodes: new NodesModel(state.nodes),
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
    const { index, value } = action.payload;

    // Instantiate new object with answered question with new answer value
    state.nodes[index] = state.nodes.instantiateNode({ ...state.nodes[index] });
    state.nodes[index].updateAnswer(value);

    return {
      ...state,
      nodes: new NodesModel(state.nodes),
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

    const question = new QuestionModel(state.algorithm.nodes[index]);
    question.updateAnswer(value);

    let nodes = filter(state.algorithm.nodes, (node) => [categories.demographic, categories.basicDemographic].includes(node.category));

    nodes = nodes.map((node) => {
      const patientValue = state.patientValues.find((pv) => pv.node_id === node.id);
      const newNode = patientValue !== undefined ? patientValue : { answer_id: null, node_id: node.id, value: null };

      // Set new value for patient value updated
      if (newNode.node_id === index) {
        newNode.answer_id = question.answer;
        newNode.value = question.value;
      }
      return newNode;
    });

    return {
      ...state,
      patientValues: nodes,
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
    const { index, value } = action.payload;

    // Instantiate new object with id unavailable answer
    // reset value to default
    state.nodes[index] = state.nodes.instantiateNode({
      ...state.nodes[index],
      answer: value,
      value: null,
    });

    return {
      ...state,
      nodes: new NodesModel(state.nodes),
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
  medicalCaseClear(state) {
    storeMedicalCase(state);

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

    if (state !== {} && medicalCase?.id !== state?.id) {
      storeMedicalCase(state);
    }

    const modelsMedicalCase = this._instanceMedicalCase(medicalCase);

    return {
      ...modelsMedicalCase,
    };
  }

  /**
   * Method call from redux persist and re set the medicalcase
   *
   * @payload medicalCase: medical case
   */
  @Action(REHYDRATE)
  rehydrate(state, action) {
    if (action.payload === undefined || action.payload === null || action.payload.id === undefined || action.payload.id === null || action.payload.uid !== undefined) {
      return initialState;
    }
    console.log(action, initialState);

    const modelsMedicalCase = this._instanceMedicalCase(action.payload);

    modelsMedicalCase.modal.open = false;

    return {
      ...modelsMedicalCase,
    };
  }
}

export default MedicalCaseReducer.create();
