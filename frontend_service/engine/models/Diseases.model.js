// @flow

interface DiseasesInterface {
  diagnosis: Object;
  differential: Object;
  id: number;
  label: string;
  nodes: Object;
  reference: string;
}

export class DiseasesModel implements DiseasesInterface {
  constructor(id, diagnosis, label, differential, reference, nodes) {
    this.id = id;
    this.diagnosis = diagnosis;
    this.label = label;
    this.differential = differential;
    this.reference = reference;
    this.nodes = nodes;
  }
}
