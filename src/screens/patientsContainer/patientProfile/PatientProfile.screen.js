// @flow
import * as React from 'react';
import { ListItem, Text, View, Button, Icon } from 'native-base';
import { FlatList, ScrollView } from 'react-native';

import { medicalCaseStatus, routeDependingStatus, modalType } from '../../../../frontend_service/constants';
import { LiwiTitle2 } from '../../../template/layout';
import { getDeviceInformation } from '../../../engine/api/Device';
import { getItems } from '../../../engine/api/LocalStorage';
import { styles } from './PatientProfile.style';
import LiwiLoader from '../../../utils/LiwiLoader';
import { MedicalCaseModel } from '../../../../frontend_service/engine/models/MedicalCase.model';

export default class PatientProfile extends React.Component {
  state = {
    patient: {
      medicalCases: [],
    },
    firstRender: false,
    deviceInfo: null,
    nodes: {},
    columns: [],
  };

  async componentDidMount() {
    const deviceInfo = await getDeviceInformation();
    const algorithm = await getItems('algorithm');
    const isConnected = await getItems('isConnected');

    const columns = algorithm.mobile_config.medical_case_list;
    const { nodes } = algorithm;

    this.setState({ deviceInfo, columns, nodes, isConnected });
    await this._getPatient();
  }

  async componentDidUpdate() {
    const { navigation } = this.props;

    // TODO: Do it better
    if (navigation.getParam('refresh')) {
      navigation.setParams({ refresh: false });
      await this._getPatient();
    }
  }

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
   * Medical case rendering
   * @param {object} medicalCase
   * @returns {*}
   * @private
   */
  _renderItem = (medicalCase) => {
    const {
      setMedicalCase,
      navigation,
      updateModalFromRedux,
      app: { t, database, user },
    } = this.props;
    const { columns, deviceInfo, isConnected } = this.state;
    const size = 1 / columns.length + 1;
    return (
      <ListItem
        style={styles.item}
        key={`${medicalCase.id}_list`}
        onPress={async () => {
          const newMedicalCase = await database.findBy('MedicalCase', medicalCase.id);
          const currentConnectionStatus = await getItems('isConnected');

          if (newMedicalCase.isLocked(deviceInfo, user) && currentConnectionStatus) {
            updateModalFromRedux({ medicalCase: newMedicalCase }, modalType.medicalCaseLocked);
          } else if (newMedicalCase.status === medicalCaseStatus.close) {
            navigation.navigate('Summary', { medicalCase });
          } else {
            // Set medical case in store and lock case
            await setMedicalCase(newMedicalCase);
            await database.lockMedicalCase(newMedicalCase.id);

            navigation.navigate(routeDependingStatus(newMedicalCase), {
              idPatient: newMedicalCase.patient_id,
              newMedicalCase: false,
            });
          }
        }}
      >
        {medicalCase.values.map((value) => (
          <View style={{ flex: size }} key={`${medicalCase.id}`}>
            <Text size-auto>{value}</Text>
          </View>
        ))}
        <View style={{ flex: size }}>
          <Text size-auto>{t(`medical_case:${medicalCase.status}`)}</Text>
        </View>
        {isConnected ? (
          <View style={styles.itemLock}>
            <Text size-auto right>
              {MedicalCaseModel.isLocked(medicalCase, deviceInfo, user) ? <Icon name="lock" type="EvilIcons" style={styles.lock} /> : null}
            </Text>
          </View>
        ) : null}
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
      app: { t, algorithm },
      navigation,
    } = this.props;
    const { patient, firstRender, nodes, columns } = this.state;
    return !firstRender ? (
      <LiwiLoader />
    ) : (
      <View style={styles.container}>
        <View style={styles.patientValuesContainer}>
          <View padding-auto margin-top style={styles.flex}>
            <LiwiTitle2 noBorder>{t('patient_profile:personal_information')}</LiwiTitle2>
            <ScrollView>
              <View style={styles.patientValuesContent}>
                {patient.patientValues.map((patientValue) => (
                  <View key={patientValue.node_id} style={styles.wrapper}>
                    <Text size-auto style={styles.identifierText}>
                      {nodes[patientValue.node_id].label}
                    </Text>
                    <Text size-auto style={styles.patientValues}>
                      {patient.getLabelFromNode(patientValue.node_id, nodes)}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
          <Button
            block
            style={styles.marginBottom}
            onPress={() => {
              navigation.navigate('PatientEdit', {
                patient,
              });
            }}
          >
            <Text size-auto>{t('patient_profile:edit_patient_value')}</Text>
          </Button>
        </View>

        <View style={styles.flex06}>
          <View padding-auto>
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
              data={patient.medicalCasesLight(algorithm)}
              contentContainerStyle={styles.flatList}
              renderItem={(value) => this._renderItem(value.item)}
              ItemSeparatorComponent={this._renderSeparator}
              keyExtractor={(item) => item.id}
            />
          </View>

          <View style={styles.footerButton}>
            <Button
              block
              onPress={() => {
                navigation.navigate('PatientUpsert', {
                  idPatient: patient.id,
                  newMedicalCase: true,
                });
              }}
            >
              <Text size-auto>{t('patient_profile:add_case')}</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
