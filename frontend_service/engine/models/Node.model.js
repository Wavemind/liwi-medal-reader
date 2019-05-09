// @flow
import { nodesType } from '../../constants';
import { MedicalCaseModel } from './MedicalCase.model';

const { ps, d, fd, m, q, t } = nodesType;

interface NodeInterface {
  id: number;
  type: ps | d | fd | m | q | t;
  reference: string;
  medicalCase: MedicalCaseModel;
}

export class NodeModel implements NodeInterface {
  constructor(props) {
    const { id = 0, type = '', reference = ''} = props;
    this.id = id;
    this.type = type;
    this.reference = reference;

    console.log('node model', this.id)
  }
}
