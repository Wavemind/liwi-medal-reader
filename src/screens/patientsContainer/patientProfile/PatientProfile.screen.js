// @flow
import * as React from 'react';
import { ListItem, Text, View, Button } from 'native-base';
import { FlatList } from 'react-native';

import { routeDependingStatus, toolTipType } from '../../../../frontend_service/constants';
import { updateModalFromRedux } from '../../../../frontend_service/actions/creators.actions';
import { LiwiTitle2 } from '../../../template/layout';
import { getDeviceInformation } from '../../../engine/api/Device';
import { getItems } from '../../../engine/api/LocalStorage';
import { styles } from './PatientProfile.style';
import LiwiLoader from '../../../utils/LiwiLoader';

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

    const columns = algorithm.mobile_config.medical_case_list;
    const { nodes } = algorithm;

    this.setState({ deviceInfo, columns, nodes });
    await this._getPatient();
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
      app: { t, database, user },
    } = this.props;
    const { columns, nodes, deviceInfo } = this.state;
    const size = 1 / columns.length + 1;

    return (
      <ListItem
        style={styles.item}
        key={`${medicalCase.id}_list`}
        onPress={async () => {
          const newMedicalCase = await database.findBy('MedicalCase', medicalCase.id);
          const isConnected = await getItems('isConnected');

          if (newMedicalCase.isLocked(deviceInfo, user) && isConnected) {
            updateModalFromRedux({ medicalCase: newMedicalCase }, toolTipType.medicalCaseLocked);
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
        {columns.map((nodeId) => (
          <View style={{ flex: size }} key={`${medicalCase.id}_${nodeId}`}>
            <Text size-auto>{medicalCase.getLabelFromNode(nodeId, nodes)}</Text>
          </View>
        ))}
        <View style={{ flex: size }}>
          <Text size-auto>{t(`medical_case:${medicalCase.status}`)}</Text>
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
      navigation,
    } = this.props;
    const { patient, firstRender, nodes, columns } = this.state;
    return !firstRender ? (
      <LiwiLoader />
    ) : (
      <>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
          <View padding-auto margin-top style={{ flex: 1 }}>
            <LiwiTitle2 noBorder>{t('patient_profile:personal_information')}</LiwiTitle2>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
              {patient.patientValues.map((patientValue) => (
                <View style={styles.wrapper}>
                  <Text size-auto style={styles.identifierText}>
                    {nodes[patientValue.node_id].label}
                  </Text>
                  <Text size-auto style={styles.patientValues}>
                    {patient.getLabelFromNode(patientValue.node_id, nodes)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Button
              block
              onPress={() => {
                navigation.navigate('PatientEdit', {
                  idPatient: patient.id,
                });
              }}
            >
              <Text size-auto>{t('patient_profile:edit_patient_value')}</Text>
            </Button>
          </View>
        </View>

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
            data={patient.medicalCases}
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
      </>
    );
  }
}
