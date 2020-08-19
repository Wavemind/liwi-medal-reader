import { Action, ReducerClass } from 'reducer-class';

import { REHYDRATE } from 'redux-persist';
import { filter } from 'lodash';
import 'reflect-metadata';

import { actions } from '../../actions/types.actions';
import { categories } from '../../constants';
import { MedicalCaseModel } from '../../engine/models/MedicalCase.model';
import { NodesModel } from '../../engine/models/Nodes.model';
import { newDrugsFilter } from '../../algorithm/treeDiagnosis.algo';
import { QuestionModel } from '../../engine/models/Question.model';
import { DiagnosticModel } from '../../engine/models/Diagnostic.model';

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
   * Sets the consent file in the patient after scanning it, the consent in the
   * medical case is automaticaly set to true
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
   * @payload diagnosesKey: the diagnosey identifiant
   * @payload medicineId: the medecin identifiant
   * @payload boolean: the agreed / unagree value
   */
  @Action(actions.SET_MEDICINE)
  setMedicine(state, action) {
    const { type, diagnosesKey, medicineId, boolean } = action.payload;

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
        [type]: {
          ...state.diagnoses[type],
          [diagnosesKey]: {
            ...state.diagnoses[type][diagnosesKey],
            drugs: {
              ...state.diagnoses[type][diagnosesKey].drugs,
              [medicineId]: {
                ...state.diagnoses[type][diagnosesKey].drugs[medicineId],
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
    const { nodeId, value } = action.payload;

    // Instantiate new object with answered question with new answer value
    state.nodes[nodeId] = state.nodes.instantiateNode({ ...state.nodes[nodeId] });
    state.nodes[nodeId].updateAnswer(value);

    return {
      ...state,
      nodes: new NodesModel(state.nodes),
    };
  }

  /**
   * Set estimable value for basic measurement question
   * @param state
   * @param action
   * @returns {{nodes: NodesModel}}
   */
  @Action(actions.SET_ESTIMABLE)
  setEstimable(state, action) {
    const { index, value } = action.payload;

    // Instantiate new object with answered question with new answer value
    state.nodes[index] = state.nodes.instantiateNode({ ...state.nodes[index] });
    state.nodes[index].estimableValue = value;

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
    const { nodeId, value } = action.payload;

    // Instantiate new object with id unavailable answer
    // reset value to default
    state.nodes[nodeId] = state.nodes.instantiateNode({
      ...state.nodes[nodeId],
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

    const modelsMedicalCase = MedicalCaseModel.copyMedicalCase(medicalCase);
    return {
      ...modelsMedicalCase,
      json: null,
      patient: {
        ...modelsMedicalCase.patient,
        medicalCases: [],
      },
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

    const modelsMedicalCase = this._instanceMedicalCase(action.payload);

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
