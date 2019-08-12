import { combineEpics } from 'redux-observable';
import {
  epicCatchAnswer,
  epicCatchDispatchNodeAction,
  epicCatchDispatchCondition,
  epicCatchDiagnosisChildren,
  epicCatchPredefinedSyndromeChildren,
} from './EpicTreesNodes';


export default combineEpics(
  epicCatchPredefinedSyndromeChildren,
  epicCatchAnswer,
  epicCatchDiagnosisChildren,
  epicCatchDispatchNodeAction,
  epicCatchDispatchCondition
);
