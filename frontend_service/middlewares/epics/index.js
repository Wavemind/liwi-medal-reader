import { combineEpics } from 'redux-observable';
import {
  epicCatchAnswer,
  epicCatchDispatchNodeAction,
  epicCatchDiseasesChildren,
  epicCatchDiagnosisChildren,
  epicCatchPredefinedSyndromeChildren,
} from './EpicTreesNodes';


export default combineEpics(
  epicCatchPredefinedSyndromeChildren,
  epicCatchAnswer,
  epicCatchDiagnosisChildren,
  epicCatchDispatchNodeAction,
  epicCatchDiseasesChildren
);
