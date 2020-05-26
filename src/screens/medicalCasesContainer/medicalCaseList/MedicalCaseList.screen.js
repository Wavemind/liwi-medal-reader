// @flow

import * as React from 'react';
import { Icon, Input, Item, View } from 'native-base';

import { routeDependingStatus, toolTipType } from '../../../../frontend_service/constants';
import { updateModalFromRedux } from '../../../../frontend_service/actions/creators.actions';
import { getDeviceInformation } from '../../../engine/api/Device';
import { SeparatorLine } from '../../../template/layout';
import { getItems } from '../../../engine/api/LocalStorage';
import { styles } from './MedicalCaseList.style';
import ListContent from '../../../components/ListContent';

export default class MedicalCaseList extends React.Component<Props, State> {
  state = {
    searchTerm: '',
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
      app: { database, user },
    } = this.props;
    const { deviceInfo } = this.state;

    const newMedicalCase = await database.findBy('MedicalCase', medicalCase.id);
    const isConnected = await getItems('isConnected');

    if (newMedicalCase.isLocked(deviceInfo, user) && isConnected) {
      updateModalFromRedux({ medicalCase: newMedicalCase }, toolTipType.medicalCaseLocked);
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
    const { searchTerm } = this.state;

    return (
      <>
        <View padding-auto margin-top>
          <View style={styles.flexDirectionRow}>
            <Item style={styles.inputGroup}>
              <Icon active name="search" />
              <Input value={searchTerm} onChangeText={this.searchBy} />
            </Item>
          </View>
        </View>

        <ListContent model="MedicalCase" list="medical_case_list" itemNavigation={this.itemNavigation} />
      </>
    );
  }
}
