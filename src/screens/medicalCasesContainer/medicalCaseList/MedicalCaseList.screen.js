// @flow

import * as React from 'react';

import { medicalCaseStatus, routeDependingStatus, toolTipType } from '../../../../frontend_service/constants';
import { getDeviceInformation } from '../../../engine/api/Device';
import { getItems } from '../../../engine/api/LocalStorage';
import ListContent from '../../../components/ListContent';

export default class MedicalCaseList extends React.Component<Props, State> {
  state = {
    query: '',
  };

  async componentDidMount() {
    const deviceInfo = await getDeviceInformation();
    this.setState({ deviceInfo });
  }

  /**
   * Set medical case in store
   * @param {object} medicalCase
   * @returns {Promise<void>}
   */
  selectMedicalCase = async (medicalCase) => {
    const { setMedicalCase } = this.props;
    await setMedicalCase({ ...medicalCase, patient: await medicalCase.getPatient() });
  };

  /**
   * Action call when element of flatlist is clicked
   * @param {object} medicalCase - Medical case clicked
   * @returns {Promise<void>}
   */
  itemNavigation = async (medicalCase) => {
    const {
      navigation,
      updateModalFromRedux,
      app: { database, user },
    } = this.props;
    const { deviceInfo } = this.state;

    const newMedicalCase = await database.findBy('MedicalCase', medicalCase.id);
    const isConnected = await getItems('isConnected');

    if (newMedicalCase.isLocked(deviceInfo, user) && isConnected) {
      updateModalFromRedux({ medicalCase: newMedicalCase }, toolTipType.medicalCaseLocked);
    } else if (newMedicalCase.status === medicalCaseStatus.close) {
      navigation.navigate('Summary', { medicalCase });
    } else {
      // Set medical case in store and lock case
      await this.selectMedicalCase({ ...medicalCase });
      await database.lockMedicalCase(newMedicalCase.id);

      navigation.navigate(routeDependingStatus(newMedicalCase), {
        idPatient: newMedicalCase.patient_id,
        newMedicalCase: false,
      });
    }
  };

  render() {
    const { query } = this.state;
    return <ListContent query={query} model="MedicalCase" list="medical_case_list" itemNavigation={this.itemNavigation} />;
  }
}
