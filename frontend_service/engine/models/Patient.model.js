// @flow

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
  constructor(props) {
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
    } = props;


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
  }
}
