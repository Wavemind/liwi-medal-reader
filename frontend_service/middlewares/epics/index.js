import {
  epicCatchAnswer,
  epicCatchDispatchNodeAction,
  epicCatchDiseasesChildren,
  epicCatchDiagnosisChildren,
  epicCatchPredefinedSyndromeChildren,
} from './EpicTreesNodes.js';
import { epicClassIntercept } from './EpicClassModel';
import { combineEpics } from 'redux-observable';

export default combineEpics(
  epicCatchPredefinedSyndromeChildren,
  epicCatchAnswer,
  epicCatchDiagnosisChildren,
  epicCatchDispatchNodeAction,
  epicCatchDiseasesChildren,
  epicClassIntercept
);
