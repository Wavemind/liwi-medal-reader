// @flow
import { nodesType } from '../../constants';
import { MedicalCaseModel } from './MedicalCase.model';

const { qs, d, fd, m, q, t } = nodesType;

interface NodeInterface {
  id: number;
  type: qs | d | fd | m | q | t;
  reference: string;
  medicalCase: MedicalCaseModel;
}

export class NodeModel implements NodeInterface {
  constructor(props) {
    const { id = 0, type = '', reference = '' } = props;
    this.id = id;
    this.type = type;
    this.reference = reference;
  }


}
