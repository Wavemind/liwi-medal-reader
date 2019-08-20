import { combineEpics } from 'redux-observable';
import {
  epicCatchAnswer,
  epicCatchDispatchNodeAction,
  epicCatchDispatchCondition,
  epicCatchFinalDiagnosticAction,
  epicCatchQuestionsSequenceAction,
  epicCatchDispatchFormulaNodeAction,
} from './EpicTreesNodes';

export default combineEpics(
  epicCatchDispatchFormulaNodeAction,
  epicCatchQuestionsSequenceAction,
  epicCatchAnswer,
  epicCatchFinalDiagnosticAction,
  epicCatchDispatchNodeAction,
  epicCatchDispatchCondition
);
