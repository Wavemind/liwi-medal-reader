// @flow
import { nodesType } from '../../constants';

const { ps, d, fd, m, q, t } = nodesType;

 interface NodeInterface {
  id: number;
  type: ps | d | fd | m | q | t;
  reference: string;
}

export class NodeModel implements NodeInterface {
  constructor(props) {
    const { id = 0, type = '', reference = '' } = props;

    this.id = id;
    this.type = type;
    this.reference = reference;
  }
}
