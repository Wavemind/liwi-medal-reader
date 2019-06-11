// @flow

import { setItem } from '../../../src/engine/api/LocalStorage';

interface PatientModelInterface {
  birthdate: string;
  breathingRhythm: string;
  email: string;
  firstname: string;
  gender: string;
  heartbeat: string;
  height: string;
  lastname: string;
  photo: string;
  temperature: string;
  weight: string;
}

export class PatientModel implements PatientModelInterface {
  constructor(props) {}

  setPatient = async () => {
    const {
      birthdate,
      breathingRhythm,
      email,
      firstname,
      gender,
      heartbeat,
      height,
      lastname,
      photo,
      temperature,
      weight,
      status,
    } = await this.generatePatient();

    this.birthdate = birthdate;
    this.breathingRhythm = breathingRhythm;
    this.email = email;
    this.firstname = firstname;
    this.gender = gender;
    this.heartbeat = heartbeat;
    this.height = height;
    this.lastname = lastname;
    this.photo = photo;
    this.temperature = temperature;
    this.weight = weight;
    this.status = status;
    this.medicalCases = [];
    this.status = 'initial';
  };

  generatePatient = async () => {
    const response = await fetch('https://uinames.com/api/?ext&region=france');
    let patient = {};

    // if the service is down
    if (response.status === 200) {
      patient = await response.json();
    } else {
      patient = {
        name: 'UinameDown',
        surname: 'la Fripouille',
        birthday: {
          dmy: '01.01.1900',
        },
        email: 'pop@pip.pap',
        photo: '',
      };
    }

    patient.renameKey('name', 'firstname');
    patient.renameKey('surname', 'lastname');

    return patient;
  };
}
