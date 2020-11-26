// @flow

import * as React from 'react';

import { medicalCaseStatus, routeDependingStatus, modalType } from '../../../../frontend_service/constants';
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
   * @param {object} medicalCaseLight
   * @returns {Promise<void>}
   */
  selectMedicalCase = async (medicalCaseLight) => {
    const {
      setMedicalCase,
      app: { database },
    } = this.props;
    const medicalCase = await database.findBy('MedicalCase', medicalCaseLight.id);
    await setMedicalCase({ ...medicalCase, patient: await medicalCase.getPatient() });
  };

  /**
   * Action call when element of flatlist is clicked
   * @param {object} medicalCaseLight - Medical case clicked
   * @returns {Promise<void>}
   */
  itemNavigation = async (medicalCaseLight) => {
    const {
      navigation,
      updateModalFromRedux,
      app: { database, user },
    } = this.props;
    const { deviceInfo } = this.state;

    const newMedicalCase = await database.findBy('MedicalCase', medicalCaseLight.id);
    const isConnected = await getItems('isConnected');

    if (newMedicalCase.isLocked(deviceInfo, user) && isConnected) {
      updateModalFromRedux({ medicalCase: newMedicalCase }, modalType.medicalCaseLocked);
    } else if (newMedicalCase.status === medicalCaseStatus.close) {
      navigation.navigate('Summary', { medicalCaseLight });
    } else {
      // Set medical case in store and lock case
      await this.selectMedicalCase(medicalCaseLight);
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
