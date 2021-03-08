import uuid from 'react-native-uuid';
import moment from 'moment';

import { differenceNodes } from '../swissKnives';
import { getItem } from '../../engine/api/LocalStorage';
import { MedicalCaseModel } from '../../../frontend_service/helpers/MedicalCase.model';

export const patientTemplate = async () => {
  const faker = require('faker');

  const id = uuid.v4();

  const patient = {
    id,
    uid: id,
    study_id: 'Generated',
    group_id: '5',
    medicalCases: [],
    updated_at: faker.fake('{{date.past}}'),
    fail_safe: false,
  };
  const algorithm = await getItem('algorithm');
  const { basic_questions } = algorithm.config;
  const medicalCase = await new MedicalCaseModel({}, algorithm);

  medicalCase.nodes[basic_questions.first_name_question_id].value = faker.fake('{{name.firstName}}');
  medicalCase.nodes[basic_questions.last_name_question_id].value = faker.fake('{{name.lastName}}');
  medicalCase.nodes[basic_questions.weight_question_id].value = faker.random.number({ max: 14, min: 6 });
  medicalCase.nodes[basic_questions.gender_question_id].answer_id = Object.keys(algorithm.nodes[basic_questions.gender_question_id].answers)[faker.random.number({ max: 1, min: 0 })];
  medicalCase.nodes[basic_questions.birth_date_question_id].value = faker.fake('{{date.past}}');

  const today = moment();
  const fifteenYearsAgo = moment().subtract(15, 'years');
  medicalCase.nodes[basic_questions.birth_date_question_id].value = faker.date.between(fifteenYearsAgo.format('YYYY-MM-DD'), today.format('YYYY-MM-DD'));

  medicalCase.activities = [
    {
      id: uuid.v4(),
      stage: 'creation',
      clinician: 'Alain Fresco',
      nodes: JSON.stringify(differenceNodes(medicalCase.nodes, algorithm.nodes)),
      mode: 'client-server',
      mac_address: faker.fake('{{internet.mac}}'),
      created_at: moment().toDate(),
      synchronized_at: moment().toDate(),
      fail_safe: false,
    },
  ];
  medicalCase.json = JSON.stringify(medicalCase);
  medicalCase.patient_id = patient.id;
  patient.medicalCases.push(medicalCase);
  return patient;
};
