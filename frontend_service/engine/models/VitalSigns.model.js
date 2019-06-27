// @flow

import i18n from '../../../src/utils/i18n';

interface VitalSignsModelInterface {
  temperature: number;
  heart_rate: number;
  height: number;
  weight: number;
  respiratory_rate: number;
}

export class VitalSignsModel implements VitalSignsModelInterface {
  constructor(props) {
    this.create(props);
  }

  // Generate default vital signs value
  create = (props = {}) => {
    const {
      temperature = '',
      heartRate = '',
      height = '',
      weight = '',
      respiratoryRate = '',
    } = props;

    this.temperature = temperature;
    this.heartRate = heartRate;
    this.height = height;
    this.weight = weight;
    this.respiratoryRate = respiratoryRate;
  };


  // Validate input
  validate = async () => {
    let errors = {};

    if (this.temperature === '') {
      errors.temperature = i18n.t('form:required');
    }

    if (this.heartRate === '') {
      errors.heartRate = i18n.t('form:required');
    }

    if (this.height === '') {
      errors.height = i18n.t('form:required');
    }

    if (this.weight === '') {
      errors.weight = i18n.t('form:required');
    }

    if (this.respiratoryRate === '') {
      errors.respiratoryRate = i18n.t('form:required');
    }

    return errors;
  };

}
