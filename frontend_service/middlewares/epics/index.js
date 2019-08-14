import { combineEpics } from 'redux-observable';
import {
  epicCatchAnswer,
  epicCatchDispatchNodeAction,
  epicCatchDispatchCondition,
  epicCatchFinalDiagnosticAction,
  epicCatchQuestionsSequenceAction,
} from './EpicTreesNodes';


export default combineEpics(
  epicCatchQuestionsSequenceAction,
  epicCatchAnswer,
  epicCatchFinalDiagnosticAction,
  epicCatchDispatchNodeAction,
  epicCatchDispatchCondition
);
