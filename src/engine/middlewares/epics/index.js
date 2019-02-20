import {
  epicCatchAnswer,
  epicCatchNodeOfThisChildren,
  epicCatchDiseasesChildren,
  epicCatchDiagnosisChildren,
} from './EpicTreesNodes.js';
import { fetchUserEpic } from './epic_two.js';
import { combineEpics } from 'redux-observable';

export default combineEpics(
  epicCatchAnswer,
  epicCatchDiagnosisChildren,
  fetchUserEpic,
  epicCatchNodeOfThisChildren,
  epicCatchDiseasesChildren
);
