// @flow
import * as React from 'react';
import { ListItem, Text, View } from 'native-base';
import { FlatList } from 'react-native';

import { LiwiTitle2 } from '../../../template/layout';
import { getDeviceInformation } from '../../../engine/api/Device';
import { getItems } from '../../../engine/api/LocalStorage';
import { styles } from './PatientProfile.style';
import LiwiLoader from '../../../utils/LiwiLoader';
import { medicalCaseStatus } from '../../../../frontend_service/constants';

export default class PatientProfile extends React.Component {
  state = {
    patient: {
      medicalCases: [],
    },
    firstRender: false,
    algorithm: {},
    deviceInfo: null,
  };

  async componentDidMount() {
    const deviceInfo = await getDeviceInformation();
    const isConnected = await getItems('isConnected');
    const algorithm = await getItems('algorithm');

    const columns = algorithm.mobile_config.medical_case_list;
    const { nodes } = algorithm;

    this.setState({ deviceInfo, isConnected, columns, nodes });
    await this._getPatient();
  }

  // shouldComponentUpdate(nextProps) {
  //   const { focus } = this.props;
  //
  //   if (nextProps.focus === 'didFocus' && (focus === undefined || focus === null || focus === 'willBlur')) {
  //     this._getPatient();
  //   }
  //   return true;
  // }

  /**
   * Fetch patient data
   * @returns {Promise<void>}
   * @private
   */
  async _getPatient() {
    const {
      navigation,
      app: { database },
    } = this.props;
    const id = navigation.getParam('id');

    const patient = await database.findBy('Patient', id);
    this.setState({
      patient,
      firstRender: true,
    });
  }

  /**
   * Patient rendering
   * @param {object} item
   * @returns {*}
   * @private
   */
  _renderItem = (item) => {
    const { navigation, itemNavigation, app: {t} } = this.props;
    const { columns, nodes } = this.state;
    const size = 1 / columns.length + 1;

    return (
      <ListItem
        style={styles.item}
        key={`${item.id}_list`}
        onPress={() =>
          navigation.navigate(itemNavigation, {
            id: item.id,
          })
        }
      >
        {columns.map((nodeId) => (
          <View style={{ flex: size }} key={`${item.id}_${nodeId}`}>
            <Text size-auto>{item.getLabelFromPatientValue(nodeId, nodes)}</Text>
          </View>
        ))}
        <View style={{ flex: size }}>
          <Text size-auto>{t(`medical_case:${item.status}`)}</Text>
        </View>
      </ListItem>
    );
  };

  /**
   * Separator between flatList item
   * @returns {*}
   */
  _renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    const {
      app: { t },
    } = this.props;
    const { patient, firstRender, nodes, columns } = this.state;
    return !firstRender ? (
      <LiwiLoader />
    ) : (
      <>
        <View padding-auto margin-top>
          <LiwiTitle2 noBorder>{t('patient_profile:personal_information')}</LiwiTitle2>

          {patient.patientValues.map((patientValue) => (
            <View style={{ flexDirection: 'row' }}>
              <Text size-auto style={styles.identifierText}>
                {nodes[patientValue.node_id].label}
              </Text>
              <Text size-auto style={{ flex: 0.7, alignSelf: 'center', paddingLeft: 20 }}>
                {patient.getLabelFromPatientValue(patientValue.node_id, nodes)}
              </Text>
            </View>
          ))}
        </View>

        <View padding-auto marginTop>
          <LiwiTitle2 noBorder>{t('patient_profile:medical_cases')}</LiwiTitle2>
        </View>

        <View padding-auto style={styles.filterContent}>
          {columns.map((column) => (
            <View key={column} style={styles.columnLabel}>
              <Text size-auto>{nodes[column].label}</Text>
            </View>
          ))}
          <View style={styles.columnLabel}>
            <Text size-auto>{t('patient_profile:status')}</Text>
          </View>
        </View>

        <View padding-auto>
          <FlatList
            key="dataList"
            data={patient.medicalCases}
            contentContainerStyle={styles.flatList}
            renderItem={(value) => this._renderItem(value.item)}
            ItemSeparatorComponent={this._renderSeparator}
            keyExtractor={(item) => item.id}
          />
        </View>
      </>
    );
  }
}
