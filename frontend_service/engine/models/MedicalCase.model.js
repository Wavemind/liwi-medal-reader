// @flow

import moment from 'moment';
import { nodesType } from '../../constants';
import { PredefinedSyndromeModel } from './PredefinedSyndrome.model';
import { TreatmentModel } from './Treatment.model';
import { QuestionModel } from './Question.model';
import { ManagementModel } from './Management.model';
import { FinalDiagnosticModel } from './FinalDiagnostic.model';
import { DiseasesModel } from './Diseases.model';
import { NodeModel } from './Node.model';

interface MedicalCaseInterface {
  props: {
    id?: number,
    userId?: number,
    createdDate: string,
    algorithmReady?: boolean,
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
    },
    trip: {
      firstSymptomDate?: string,
      startDate?: string,
      endDate?: string,
      countries?: Array<any>,
    },
    comments?: mixed,
    nodes: Object,
    diseases: Object,
    createdDate: Date,
  };
}

export class MedicalCaseModel implements MedicalCaseInterface {
  constructor(props) {
    const {
      id = 0,
      userId = 0,
      nodes = {},
      diseases = {},
      patient = {},
      batches = [],
    } = props;
    this.nodes = nodes;
    this.batches = batches;
    this.diseases = diseases;
    this.id = id;
    this.userId = userId;
    this.patient = patient;
    this.createdDate = moment().format();

    this.instanceChildren();
  }

  setId(id) {
    this.id = id + 1;
  }

  instanceChild(node) {
    let modelized;

    if (node instanceof NodeModel) {
      return node
    }

    switch (node.type) {
      case nodesType.ps:
        modelized = new PredefinedSyndromeModel({
          ...node,
          medicalCase: this,
        });
        break;
      case nodesType.t:
        modelized = new TreatmentModel({ ...node });
        break;
      case nodesType.q:
        modelized = new QuestionModel({
          ...node,
          medicalCase: this,
        });
        break;
      case nodesType.m:
        modelized = new ManagementModel({ ...node });
        break;
      case nodesType.fd:
        modelized = new FinalDiagnosticModel({ ...node });
        break;
      default:
        break;
    }

    return modelized;
  }

  instanceChildren() {
    Object.keys(this.nodes).forEach((i) => {
      let node = this.nodes[i];
      this.nodes[i] = this.instanceChild(node);
    });

    Object.keys(this.diseases).forEach(
      (i) =>
        (this.diseases[i] = new DiseasesModel({
          ...this.diseases[i],
        }))
    );
  }

  static toJSON() {
    console.log('hey you want to stringify me ?');
    return {
      nodes: this.nodes,
      diseases: this.diseases,
    };
  }

  static fromJSON(obj) {
    return new this(obj);
  }
}
