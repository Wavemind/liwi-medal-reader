// @flow

export interface MedicalCaseInterface {
  props: {
    id?: number;
    userId?: number;
    createdDate: string;
    algorithmReady?: boolean;
    patient: {
      firstname?: string,
      lastname?: string,
      birthdate?: string,
      gender?: boolean,
      weight?: string,
      height?: string,
      email?: string,
      photo?: string,
      temperature?: string,
      heartbeat?: string,
      breathingRhythm?: string,
    };
    trip: {
      firstSymptomDate?: string,
      startDate?: string,
      endDate?: string,
      countries?: Array<any>,
    };
    comments?: mixed;
    nodes: Object;
    diseases: Object;
  }
}

export class MedicalCaseModel implements MedicalCaseInterface {
  constructor(props) {

    const {id = 0, userId = 0, nodes = {}, diseases= {}} = props;

    this.nodes = nodes;
    this.diseases = diseases;
    this.id = id;
    this.userId = userId;


  }
}
