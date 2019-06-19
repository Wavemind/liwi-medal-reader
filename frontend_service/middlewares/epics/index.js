import {
  epicCatchAnswer,
  epicCatchDispatchNodeAction,
  epicCatchDiseasesChildren,
  epicCatchDiagnosisChildren,
  epicCatchPredefinedSyndromeChildren,
} from './EpicTreesNodes.js';

import { combineEpics } from 'redux-observable';

export default combineEpics(
  epicCatchPredefinedSyndromeChildren,
  epicCatchAnswer,
  epicCatchDiagnosisChildren,
  epicCatchDispatchNodeAction,
  epicCatchDiseasesChildren
);
