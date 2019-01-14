import { pingEpic } from './epic_one.js';
import { fetchUserEpic } from './epic_two.js';
import { combineEpics } from 'redux-observable';

export default combineEpics(pingEpic, fetchUserEpic);
