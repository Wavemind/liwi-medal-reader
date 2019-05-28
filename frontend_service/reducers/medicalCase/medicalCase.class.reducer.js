import { Action, ReducerClass } from 'reducer-class';

import { REHYDRATE } from 'redux-persist';
import { setMedicalCase } from '../../actions/creators.actions';
import { actions } from '../../actions/types.actions';
import { generateNextBatch } from '../../algorithm/algoTreeDiagnosis';
import find from 'lodash/find';
import { displayFormats, nodesType } from '../../constants';
import findKey from 'lodash/findKey';
import { DiseasesModel } from '../../engine/models/Diseases.model';
import { NodeModel } from '../../engine/models/Node.model';
import { PredefinedSyndromeModel } from '../../engine/models/PredefinedSyndrome.model';
import { TreatmentModel } from '../../engine/models/Treatment.model';
import { QuestionModel } from '../../engine/models/Question.model';
import { ManagementModel } from '../../engine/models/Management.model';
import { FinalDiagnosticModel } from '../../engine/models/FinalDiagnostic.model';
import moment from 'moment';
import { PatientModel } from '../../engine/models/Patient.model';

export const initialState = null;

class ReducerCat extends ReducerClass {
  initialState = {};

  _instanceMedicalCase(state) {
    state.createdDate = moment().format();
    state.patient = new PatientModel(state.patient);
    state = this._generateInstanceDiseasesNode(state);
    state = this._generateInstanceNodeModel(state);
    return state;
  }

  _instanceChild(node) {
    let modelized;

    if (node instanceof NodeModel) {
      return node;
    }

    switch (node.type) {
      case nodesType.ps:
        modelized = new PredefinedSyndromeModel({
          ...node,
          medicalCase: this,
        });
        break;
      case nodesType.t:
        modelized = new TreatmentModel({ ...node });
        break;
      case nodesType.q:
        modelized = new QuestionModel({
          ...node,
          medicalCase: this,
        });
        break;
      case nodesType.m:
        modelized = new ManagementModel({ ...node });
        break;
      case nodesType.fd:
        modelized = new FinalDiagnosticModel({ ...node });
        break;
      default:
        break;
    }

    return modelized;
  }

  _generateInstanceDiseasesNode(state) {
    Object.keys(state.diseases).forEach(
      (i) =>
        (state.diseases[i] = new DiseasesModel({
          ...state.diseases[i],
        }))
    );

    return state;
  }

  _generateInstanceNodeModel(state) {
    Object.keys(state.nodes).forEach((i) => {
      let node = state.nodes[i];
      state.nodes[i] = this._instanceChild(node);
    });

    return state;
  }

  // --------------------------       Actions        --------------------------
  // --------------------------------------------------------------------------

  @Action(actions.MC_CLEAR)
  clearReducer(state, action) {
    return {};
  }

  @Action(actions.MC_GENERATE_NEXT_BATCH)
  generateNextBatch(state, action) {
    let newState = generateNextBatch(state);

    return {
      ...state,
      batches: [...newState.batches],
    };
  }

  @Action(actions.MC_CONDITION_VALUE_PS_CHANGE)
  conditionValuePsChange(state, action) {
    const { nodeId, psId, value } = action.payload;

    const ps = state.nodes[nodeId].ps;

    let changeConditionValue = find(ps, (d) => d.id === psId);
    changeConditionValue.conditionValue = value;

    let newInstanceNode = this._instanceChild({
      ...state.nodes[nodeId],
      ps: ps,
    });

    return {
      ...state,
      nodes: {
        ...state.nodes,
        [nodeId]: newInstanceNode,
      },
    };
  }

  @Action(actions.MC_CONDITION_VALUE_DISEASES_CHANGE)
  conditionValueDiseases(state, action) {
    const { nodeId, diseaseId, value } = action.payload;

    const dd = state.nodes[nodeId].dd;

    let changeConditionValue = find(dd, (d) => d.id === diseaseId);
    changeConditionValue.conditionValue = value;

    let newInstanceNode = this._instanceChild({
      ...state.nodes[nodeId],
      dd: dd,
    });

    return {
      ...state,
      nodes: {
        ...state.nodes,
        [nodeId]: newInstanceNode,
      },
    };
  }

  @Action(actions.MC_PREDEFINED_SYNDROME_SET_ANSWER)
  psSetAnswer(state, action) {
    const { indexPs, answer } = action.payload;

    let newInstanceNode = this._instanceChild({
      ...state.nodes[indexPs],
      answer: answer,
    });

    return {
      ...state,
      nodes: {
        ...state.nodes,
        [indexPs]: newInstanceNode,
      },
    };
  }

  @Action(actions.MC_QUESTION_SET)
  questionSet(state, action) {
    const { index, value } = action.payload;

    let answer;

    switch (state.nodes[index].display_format) {
      case displayFormats.input:
        if (value.length > 0) {
          answer = findKey(state.nodes[index].answers, (answerCondition) => {
            // TODO reduce the case when backend is ready
            switch (answerCondition.operator) {
              case 'more_or_equal':
                return value >= Number(answerCondition.value);

              case 'less':
                return value < Number(answerCondition.value);

              case 'more_or_equal_and_less':
                return (
                  value >= Number(answerCondition.value.split(',')[0]) &&
                  value < Number(answerCondition.value.split(',')[1])
                );

              case 'between':
                return (
                  value >= Number(answerCondition.value.split(',')[0]) &&
                  value < Number(answerCondition.value.split(',')[1])
                );

              case 'more_and_less':
                return (
                  value > Number(answerCondition.value.split(',')[0]) &&
                  value < Number(answerCondition.value.split(',')[1])
                );

              case 'more_and_less_or_equal':
                return (
                  value > Number(answerCondition.value.split(',')[0]) &&
                  value <= Number(answerCondition.value.split(',')[1])
                );

              case '>=':
                return value >= Number(answerCondition.value);

              // WORKAROUND because JSON is wrong
              case '=>':
                return value >= Number(answerCondition.value);

              case '<=':
                return value <= Number(answerCondition.value);

              case '>':
                return value >= Number(answerCondition.value);

              case '<':
                return value < Number(answerCondition.value);

              case '>=, <':
                return (
                  value >= Number(answerCondition.value.split(',')[0]) &&
                  value < Number(answerCondition.value.split(',')[1])
                );

              case '>, <=':
                return (
                  value > Number(answerCondition.value.split(',')[0]) &&
                  value <= Number(answerCondition.value.split(',')[1])
                );
            }
          });
        } else {
          answer = null;
        }

        break;

      case displayFormats.radioButton:
        answer = value;
        break;
      case displayFormats.list:
        answer = value;
        break;
      case undefined:
        answer = value;
        break;
    }

    // workaround
    // TODO why sometimes there are string number ? lodash ?
    if (answer !== 'null' && answer !== null) {
      answer = Number(answer);
    }

    let newInstanceNode = this._instanceChild({
      ...state.nodes[index],
      answer: answer,
      value: value,
    });

    return {
      ...state,
      nodes: {
        ...state.nodes,
        [index]: newInstanceNode,
      },
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
      setMedicalCase(state);
    }
    this._instanceMedicalCase(medicalCase);
    return {
      ...medicalCase,
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

    let modelsMedicalCase = this._instanceMedicalCase({ ...action.payload });

    return {
      ...modelsMedicalCase,
    };
  }
}

export default ReducerCat.create();
