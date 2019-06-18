// @flow

import moment from 'moment';
import { MCstatus, nodesType } from '../../constants';
import { PredefinedSyndromeModel } from './PredefinedSyndrome.model';
import { TreatmentModel } from './Treatment.model';
import { QuestionModel } from './Question.model';
import { ManagementModel } from './Management.model';
import { FinalDiagnosticModel } from './FinalDiagnostic.model';
import { DiseasesModel } from './Diseases.model';
import { NodeModel } from './Node.model';
import {
  getItem,
  getItemFromArray,
  getItems,
  setItemFromArray,
} from '../../../src/engine/api/LocalStorage';
import find from 'lodash/find';
import {
  generateInitialBatch,
  setInitialCounter,
} from '../../algorithm/algoTreeDiagnosis';
import forEach from 'lodash/forEach';
import maxBy from 'lodash/maxBy';

interface MedicalCaseInterface {
  props: {
    id?: number,
    userId?: number,
    createdDate: string,
    algorithmReady?: boolean,
    comments?: mixed,
    nodes: Object,
    diseases: Object,
    createdDate: Date,
  };
}

export class MedicalCaseModel implements MedicalCaseInterface {
  createMedicalCase = async (patientId) => {
    let patient = await getItemFromArray('patients', 'id', patientId);
    let algorithms = await getItems('algorithms');
    let patients = await getItem('patients');

    const algorithmUsed = find(algorithms, (a) => a.selected);

    // default counter on each node
    setInitialCounter(algorithmUsed);

    let newMedicalCase = {
      nodes: algorithmUsed.nodes,
      diseases: algorithmUsed.diseases,
    };

    // initial batch waiting on final workflow
    generateInitialBatch(newMedicalCase);

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
    newMedicalCase.status = MCstatus.wft;

    patient.medicalCases.push(newMedicalCase);

    // set in localstorage
    await setItemFromArray('patients', patient, patient.id);
  };
}
