// @flow
import * as React from 'react';
import { Text, View, Button, Icon, Tabs, Tab, Content } from 'native-base';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native';

import { medicalCaseStatus, routeDependingStatus, modalType } from '../../../../frontend_service/constants';
import { LiwiTabStyle } from '../../../template/layout';
import { getDeviceInformation } from '../../../engine/api/Device';
import { getItem } from '../../../engine/api/LocalStorage';
import { styles } from './PatientProfile.style';
import LiwiLoader from '../../../utils/LiwiLoader';
import { MedicalCaseModel } from '../../../../frontend_service/helpers/MedicalCase.model';

export default class PatientProfile extends React.Component {
  state = {
    patient: {
      medicalCases: [],
    },
    firstRender: true,
    deviceInfo: null,
    nodes: {},
    columns: [],
    medicalCaseData: [],
  };

  async componentDidMount() {
    const deviceInfo = await getDeviceInformation();
    const algorithm = await getItem('algorithm');

    const columns = algorithm.mobile_config.medical_case_list;
    const { nodes } = algorithm;

    this.setState({ deviceInfo, columns, nodes, algorithm });
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
    const { algorithm } = this.state;

    const id = navigation.getParam('id');
    const patient = await database.findBy('Patient', id);
    const medicalCaseData = await patient.medicalCasesLight(algorithm);

    this.setState({
      patient,
      firstRender: false,
      medicalCaseData,
    });
  }

  /**
   * Prints icon at the end of the line based on medical Case status
   * @param medicalCase -  Medical case concerned
   * @returns {JSX.Element}
   */
  showIcons = (medicalCase) => {
    const {
      app: { user, isConnected },
    } = this.props;
    const { deviceInfo } = this.state;
    let icon = null;

    if (isConnected && MedicalCaseModel.isLocked(medicalCase, deviceInfo, user)) {
      icon = <Icon name="lock" type="EvilIcons" style={styles.lock} />;
    } else if (medicalCase.status !== 'close') {
      icon = <Icon dark type="EvilIcons" name="chevron-right" />;
    } else {
      icon = <Icon dark type="EvilIcons" name="eye" />;
    }

    return (
      <Text size-auto right style={styles.icons}>
        {icon}
      </Text>
    );
  };

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
      app: { t, database, user, isConnected },
    } = this.props;

    const { columns, deviceInfo, patient } = this.state;
    const size = 1 / columns.length + 1;

    return (
      <TouchableOpacity
        style={styles.item}
        key={`${medicalCase.id}_list`}
        onPress={async () => {
          const newMedicalCase = await database.findBy('MedicalCase', medicalCase.id);

          if (newMedicalCase.isLocked(deviceInfo, user) && isConnected) {
            updateModalFromRedux({ medicalCase: newMedicalCase }, modalType.medicalCaseLocked);
          } else if (newMedicalCase.status === medicalCaseStatus.close) {
            navigation.navigate('Summary', { medicalCase });
          } else {
            // Set medical case in store and lock case
            await setMedicalCase({...newMedicalCase, patient: {...patient, medicalCases: []}});
            await database.lockMedicalCase(newMedicalCase.id);

            navigation.navigate(routeDependingStatus(newMedicalCase), {
              idPatient: newMedicalCase.patient_id,
              newMedicalCase: false,
            });
          }
        }}
      >
        {medicalCase.values.map((value, index) => (
          <View style={{ flex: size }} key={`${medicalCase.id}_${index}`}>
            <Text size-auto>{value}</Text>
          </View>
        ))}
        <View style={{ flex: size }}>
          <Text size-auto>{t(`medical_case:${medicalCase.status}`)}</Text>
        </View>

        {this.showIcons(medicalCase)}
      </TouchableOpacity>
    );
  };

  /**
   * Separator between flatList item
   * @returns {*}
   */
  _renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  /**
   * Renders the patient values Tab
   * @returns {JSX.Element}
   */
  renderPatientValues = () => {
    const {
      app: { t, algorithm },
      navigation,
    } = this.props;
    const { patient, nodes } = this.state;

    return (
      <>
        <View padding-auto margin-top style={styles.flex}>
          <ScrollView>
            <View style={styles.patientValuesContent}>
              {patient.patientValues.map((patientValue) => (
                <View key={patientValue.node_id} style={styles.wrapper}>
                  <Text size-auto style={styles.identifierText}>
                    {nodes[patientValue.node_id].label}
                  </Text>
                  <Text size-auto style={styles.patientValues}>
                    {patient.getLabelFromNode(patientValue.node_id, algorithm)}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
        <View style={styles.footerButton}>
          <Button
            block
            onPress={() => {
              navigation.navigate('PatientEdit', {
                patient,
              });
            }}
          >
            <Text size-auto>{t('patient_profile:edit_patient_value')}</Text>
          </Button>
        </View>
      </>
    );
  };

  /**
   * Renders the consultation tab
   * @returns {JSX.Element}
   */
  renderConsultations = () => {
    const {
      app: { t },
      navigation,
    } = this.props;
    const { patient, nodes, columns, medicalCaseData } = this.state;

    return (
      <>
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

        <View padding-auto style={styles.consultationContainer}>
          <FlatList key="dataList" data={medicalCaseData} renderItem={(value) => this._renderItem(value.item)} ItemSeparatorComponent={this._renderSeparator} keyExtractor={(item) => item.id} />
        </View>

        {medicalCaseData.some((medicalCase) => medicalCase.status !== 'close') ? null : (
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
        )}
      </>
    );
  };

  render() {
    const {
      app: { t },
    } = this.props;
    const { firstRender } = this.state;

    if (firstRender) {
      return <LiwiLoader />;
    }

    return (
      <View style={styles.container}>
        <Tabs tabBarUnderlineStyle={LiwiTabStyle.tabBarUnderlineStyle}>
          <Tab
            heading={t('patient_profile:medical_cases')}
            tabStyle={LiwiTabStyle.tabStyle}
            activeTextStyle={LiwiTabStyle.activeTextStyle}
            textStyle={LiwiTabStyle.textStyle}
            activeTabStyle={LiwiTabStyle.activeTabStyle}
            style={LiwiTabStyle.style}
          >
            <Content
              style={styles.marginTop}
              contentContainerStyle={styles.flex} // important!
            >
              {this.renderConsultations()}
            </Content>
          </Tab>
          <Tab
            heading={t('patient_profile:personal_information')}
            tabStyle={LiwiTabStyle.tabStyle}
            activeTextStyle={LiwiTabStyle.activeTextStyle}
            textStyle={LiwiTabStyle.textStyle}
            activeTabStyle={LiwiTabStyle.activeTabStyle}
            style={LiwiTabStyle.style}
          >
            <Content
              style={styles.marginTop}
              contentContainerStyle={styles.flex} // important!
            >
              {this.renderPatientValues()}
            </Content>
          </Tab>
        </Tabs>
      </View>
    );
  }
}
