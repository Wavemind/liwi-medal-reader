import {
  epicCatchAnswer,
  epicCatchNodeOfThisChildren,
  epicCatchDiseasesChildren,
  epicCatchDiagnosisChildren,
  epicCatchPredefinedSyndromeChildren,
} from './EpicTreesNodes.js';
import { fetchUserEpic } from './epic_two.js';
import { combineEpics } from 'redux-observable';

export default combineEpics(
  epicCatchPredefinedSyndromeChildren,
  epicCatchAnswer,
  epicCatchDiagnosisChildren,
  fetchUserEpic,
  epicCatchNodeOfThisChildren,
  epicCatchDiseasesChildren
);
