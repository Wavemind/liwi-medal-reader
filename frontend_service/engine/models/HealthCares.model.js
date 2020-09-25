// @flow
/* eslint-disable no-case-declarations */
import { NodeModel } from './Node.model';
import { nodeTypes } from '../../constants';
import { store } from '../../store';

interface HealthCaresInterface { }

export class HealthCaresModel extends NodeModel implements HealthCaresInterface {
  constructor(props) {
    super(props);

    const {
      description = '',
      label = '',

    } = props;

    this.description = description;
    this.label = label;
  }
}
