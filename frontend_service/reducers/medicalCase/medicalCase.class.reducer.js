import { Action, ReducerClass } from 'reducer-class';

import { REHYDRATE } from 'redux-persist';
import find from 'lodash/find';
import findKey from 'lodash/findKey';
import { storeMedicalCase } from '../../../src/engine/api/LocalStorage';
import { actions } from '../../actions/types.actions';
import { generateNextBatch } from '../../algorithm/algoTreeDiagnosis';
import { nodesType, valueFormats } from '../../constants';
import { DiagnosticModel } from '../../engine/models/Diagnostic.model';
import { NodesModel } from '../../engine/models/Nodes.model';
import { VitalSignsModel } from '../../engine/models/VitalSigns.model';

export const initialState = null;

/*
 * Reducer
 * Catch actions from redux / dispatcher
 * Load MedicalCase on it
 *0
 *
 *
 *
 * */
class MedicalCaseReducer extends ReducerClass {
  initialState = {};

  // The state is a MedicalCase
  // Instance it
  _instanceMedicalCase(state) {
    state = this._generateInstanceDiseasesNode(state);
    state.nodes = new NodesModel(state.nodes);
    state.vitalSigns = new VitalSignsModel(state.vitalSigns);

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

  @Action(actions.MC_GENERATE_NEXT_BATCH)
  generateNextBatch(state) {
    let newState = generateNextBatch(state);

    return {
      ...state,
      batches: [...newState.batches],
    };
  }

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
    const { nodeId, callerId, value, type } = action.payload;

    let caller;
    let newNode = {
      ...state.nodes[nodeId],
    };

    switch (type) {
      case nodesType.diagnostic:
        caller = newNode.dd;
        break;
      case nodesType.questionsSequence:
        caller = newNode.qs;
        break;
    }

    let changeConditionValue = find(caller, (d) => d.id === callerId);
    changeConditionValue.conditionValue = value;

    state.nodes[nodeId] = state.nodes.instantiateNode({ ...newNode });

    return {
      ...state,
      nodes: new NodesModel(state.nodes),
    };
  }

  @Action(actions.MC_PREDEFINED_SYNDROME_SET_ANSWER)
  psSetAnswer(state, action) {
    const { indexPs, answer } = action.payload;

    state.nodes[indexPs] = state.nodes.instantiateNode({
      ...state.nodes[indexPs],
      answer: answer,
    });

    return {
      ...state,
      nodes: new NodesModel(state.nodes),
    };
  }

  @Action(actions.MC_SET_VITAL_SIGNS)
  setVitalSigns(state, action) {
    const { index, value } = action.payload;

    return {
      ...state,
      vitalSigns: new VitalSignsModel({
        ...state.vitalSigns,
        [index]: value,
      }),
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

    let answer;
    switch (state.nodes[index].value_format) {
      case valueFormats.int:
      case valueFormats.float:
        answer = findKey(state.nodes[index].answers, (answerCondition) => {
          switch (answerCondition.operator) {
            case 'more_or_equal':
              return value >= Number(answerCondition.value);

            case 'less':
              return value < Number(answerCondition.value);

            case 'between':
              return (
                value >= Number(answerCondition.value.split(',')[0]) &&
                value < Number(answerCondition.value.split(',')[1])
              );
          }
        });
        break;
      case valueFormats.bool:
      case valueFormats.array:
        answer = value;
        break;
      default:
        // eslint-disable-next-line no-console
        console.log(
          '%c --- DANGER --- ',
          'background: #FF0000; color: #F6F3ED; padding: 5px',
          `Unhandled question format ${state.nodes[index].display_format}`,
          state.nodes[index]
        );
        answer = value;
        break;
    }
    // Instantiate new object with answered question with new answer value
    state.nodes[index] = state.nodes.instantiateNode({
      ...state.nodes[index],
      answer: answer,
      value: value,
    });

    return {
      ...state,
      nodes: new NodesModel(state.nodes),
    };
  }

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

  @Action(actions.MC_SET)
  medicalCaseSet(state, action) {
    const { medicalCase } = action.payload;

    if (state !== {} && medicalCase.id !== state.id) {
      storeMedicalCase(state);
    }

    let modelsMedicalCase = this._instanceMedicalCase(medicalCase);

    return {
      ...modelsMedicalCase,
    };
  }

  @Action(REHYDRATE)
  rehydrate(state, action) {
    if (
      action.payload === undefined ||
      action.payload === null ||
      action.payload.id === undefined ||
      action.payload.id === null
    ) {
      return initialState;
    }

    let modelsMedicalCase = this._instanceMedicalCase(action.payload);

    return {
      ...modelsMedicalCase,
    };
  }
}

export default MedicalCaseReducer.create();
