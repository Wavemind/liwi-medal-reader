// @flow

import moment from 'moment';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import maxBy from 'lodash/maxBy';
import { medicalCaseStatus } from '../../constants';
import {
  getItem,
  getItemFromArray,
  getItems,
  setItemFromArray,
} from '../../../src/engine/api/LocalStorage';
import {
  generateExcludedId,
  setInitialCounter,
} from '../../algorithm/algoTreeDiagnosis';

interface MedicalCaseInterface {
  props: {
    id?: number,
    userId?: number,
    createdDate: string,
    algorithmReady?: boolean,
    comments?: mixed,
    nodes: Object,
    diagnostics: Object,
    createdDate: Date,
  };
}

export class MedicalCaseModel implements MedicalCaseInterface {
  create = async (patientId, extraQuestions) => {
    let patient = await getItemFromArray('patients', 'id', patientId);
    let algorithms = await getItems('algorithms');
    let patients = await getItem('patients');

    const algorithmUsed = find(algorithms, (a) => a.selected);

    // default counter on each node
    setInitialCounter(algorithmUsed);

    let newMedicalCase = {
      ...algorithmUsed,
      nodes: { ...algorithmUsed.nodes }, // Merged nodes with algo and extraQuestions from other side
      diagnostics: algorithmUsed.diagnostics,
    };

    //TODO : @ MICK Il faut dispatch un setAnswer pour trigger les mise à jour sur les enfant !
    Object.keys(extraQuestions).map(extraQuestionId => {
      newMedicalCase.nodes[extraQuestionId].value = extraQuestions[extraQuestionId].value;
      newMedicalCase.nodes[extraQuestionId].answer = extraQuestions[extraQuestionId].answer;
    });

    generateExcludedId(newMedicalCase);

    // initial batch waiting on final workflow

    let eachMaxId = [];

    // find recursive max id in medicalCases
    forEach(patients, (p) => {
      let itemMax = maxBy(p.medicalCases, 'id');
      if (itemMax !== undefined) {
        eachMaxId.push(itemMax);
      }
    });

    // on each maxBy, take the final maxBy
    let maxId = maxBy(eachMaxId, 'id');

    if (eachMaxId.length === 0) {
      maxId = { id: 0 };
    }

    newMedicalCase.id = maxId.id + 1;
    newMedicalCase.createdDate = moment().format();
    newMedicalCase.status = medicalCaseStatus.waitingTriage.name;

    patient.medicalCases.push(newMedicalCase);

    // set in localstorage
    await setItemFromArray('patients', patient, patient.id);
    this.id = newMedicalCase.id;
  };
}
