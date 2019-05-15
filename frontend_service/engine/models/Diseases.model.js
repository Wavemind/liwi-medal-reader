// @flow

import { NodeModel } from './Node.model';

interface DiseasesInterface {
  diagnosis: Object;
  differential: Object;
  id: number;
  label: string;
  nodes: Object;
  reference: string;
}

export class DiseasesModel implements DiseasesInterface {
  constructor(props) {

    const { id, diagnosis, label, differential, reference, nodes } = props;

    console.log(props)

    this.id = id;
    this.diagnosis = diagnosis;
    this.label = label;
    this.differential = differential;
    this.reference = reference;
    this.nodes = nodes;
  }
}
