// @flow

import * as React from 'react';
import * as _ from 'lodash';
import { NavigationActions, NavigationScreenProps, StackActions } from 'react-navigation';
import { Button, Col, Text, View } from 'native-base';
import { ScrollView } from 'react-native';

import NavigationService from '../../../engine/navigation/Navigation.service';
import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import { MedicalCaseModel } from '../../../../frontend_service/engine/models/MedicalCase.model';
import { LiwiTitle2 } from '../../../template/layout';

import { getItems } from '../../../engine/api/LocalStorage';
import { styles } from './PatientUpsert.style';
import { stages } from '../../../../frontend_service/constants';
import LiwiLoader from '../../../utils/LiwiLoader';
import Questions from '../../../components/QuestionsContainer/Questions';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientUpsert extends React.Component<Props, State> {
  state = {
    errors: {},
    patient: null,
    loading: true,
    algorithmReady: false,
    otherFacilityData: null,
  };

  initializeComponent = async () => {
    const {
      navigation,
      setMedicalCase,
      app: { database },
    } = this.props;

    let patient = {};

    const patientId = navigation.getParam('idPatient');
    const newMedicalCase = navigation.getParam('newMedicalCase'); // boolean
    const otherFacilityData = navigation.getParam('otherFacilityData'); // Object
    const identifier = navigation.getParam('identifier'); // Object
    const algorithms = await getItems('algorithms');

    if (patientId === null) {
      patient = new PatientModel({ otherFacilityData, identifier });
    } else {
      patient = await database.findBy('Patient', patientId);
    }

    if (algorithms.length === 0) {
      this.setState({ patient });
    } else {
      if (newMedicalCase) {
        const generatedMedicalCase = await new MedicalCaseModel({}, algorithms[algorithms.length - 1]);

        await setMedicalCase({
          ...generatedMedicalCase,
          patient: { ...patient, medicalCases: [] }, // Force
        });
      }

      this.setState({
        patient,
        algorithmReady: true,
        loading: false,
      });
    }
  };

  async componentDidMount() {
    await this.initializeComponent();
  }

  /**
   * Save patient and redirect to parameters
   * @params [String] route
   */
  save = async (newRoute) => {
    const {
      navigation,
      medicalCase,
      updateMedicalCaseProperty,
      app: { database },
    } = this.props;
    const patientId = navigation.getParam('idPatient');
    let isSaved = false;

    await this.setState({ loading: true });

    updateMedicalCaseProperty('isNewCase', false); // Workaround because redux persist is buggy with boolean

    if (patientId !== null) {
      const patient = database.findBy('Patient', patientId);
      isSaved = patient.addMedicalCase(medicalCase);
    } else {
      isSaved = await this.savePatient();
    }
    if (isSaved) {
      const currentRoute = NavigationService.getCurrentRoute();
      // Replace the nextRoute navigation at the current index
      navigation.dispatch(
        StackActions.replace({
          index: currentRoute.index,
          newKey: newRoute,
          routeName: newRoute,
          params: {
            initialPage: 0,
          },
          actions: [
            NavigationActions.navigate({
              routeName: newRoute,
            }),
          ],
        })
      );

      await this.setState({ loading: false });
    }
  };

  /**
   * Update state value of patient
   * @params [String] key [String] value
   */
  updatePatientValue = async (key, value) => {
    const { patient } = this.state;
    const { updatePatient } = this.props;
    updatePatient(key, value);
    patient[key] = value;
    await this.setState({ patient });
  };

  /**
   * Set patient and medical case in localStorage
   */
  savePatient = async () => {
    const { patient } = this.state;
    const { medicalCase } = this.props;
    const errors = await patient.validate();

    // Create patient if there are no errors
    if (_.isEmpty(errors)) {
      patient.medicalCases.push(medicalCase);
      await patient.save();

      return true;
    }
    this.setState({ errors });
    return false;
  };

  renderIdentifierData = () => {
    const { patient } = this.state;
    const { t } = this.props.app;

    if (patient === null) {
      return null;
    }

    const { uid, studyID, groupID, secondUid, secondStudyID, secondGroupID } = patient;

    return (
      <View>
        <Text customSubTitle>{t('patient_upsert:identifier')}</Text>
        <View w50>
          <Text style={styles.identifierText}>{t('patient_upsert:uid')}</Text>
          <Text style={styles.identifierText} right>
            {uid}
          </Text>
        </View>
        <View w50>
          <Text style={styles.identifierText}>{t('patient_upsert:studyID')}</Text>
          <Text style={styles.identifierText} right>
            {studyID}
          </Text>
        </View>

        <View w50>
          <Text style={styles.identifierText}>{t('patient_upsert:groupID')}</Text>
          <Text style={styles.identifierText} right>
            {groupID}
          </Text>
        </View>

        {patient.wasInOtherFacility() && (
          <>
            <View w50>
              <Text style={styles.identifierText}>{t('patient_upsert:secondUid')}</Text>
              <Text style={styles.identifierText} right>
                {secondUid}
              </Text>
            </View>
            <View w50>
              <Text style={styles.identifierText}>{t('patient_upsert:secondStudyID')}</Text>
              <Text style={styles.identifierText} right>
                {secondStudyID}
              </Text>
            </View>
            <View w50>
              <Text style={styles.identifierText}>{t('patient_upsert:secondGroupID')}</Text>
              <Text style={styles.identifierText} right>
                {secondGroupID}
              </Text>
            </View>
          </>
        )}
      </View>
    );
  };

  render() {
    const { updatePatientValue, save } = this;
    const { patient, errors, loading, algorithmReady } = this.state;

    const {
      app: { t },
      medicalCase,
      updateMetaData,
    } = this.props;

    let extraQuestions = [];
    if (medicalCase.nodes !== undefined) {
      // Get nodes to display in registration stage
      extraQuestions = medicalCase.nodes?.filterBy(
        [
          {
            by: 'stage',
            operator: 'equal',
            value: stages.registration,
          },
        ],
        'OR',
        'array',
        false
      );
    }

    let hasNoError = false;
    if (patient !== null) {
      hasNoError = !_.isEmpty(patient?.validate());
    }
    if (medicalCase.nodes !== undefined && medicalCase.metaData.patientupsert.custom.length === 0 && extraQuestions.length !== 0) {
      updateMetaData(
        'patientupsert',
        'custom',
        extraQuestions.map(({ id }) => id)
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always" testID="PatientUpsertScreen">
        <LiwiTitle2 noBorder>{t('patient_upsert:title')}</LiwiTitle2>
        {loading ? (
          <LiwiLoader />
        ) : (
            <React.Fragment>
              <View>
                <Col>
                  {this.renderIdentifierData()}
                  {patient.wasInOtherFacility() && (
                    <CustomInput
                      init={patient.reason}
                      label={t('patient:reason')}
                      change={updatePatientValue}
                      index="reason"
                      iconName="sign-out"
                      iconType="FontAwesome"
                      error={errors.reason}
                      autoCapitalize="sentences"
                    />
                  )}
                </Col>
              </View>
              <Text customSubTitle>{t('patient_upsert:questions')}</Text>
              <Questions questions={extraQuestions} />
              <View bottom-view>
                {algorithmReady ? (
                  !loading ? (
                    <View columns>
                      <Button light split onPress={() => save('PatientList')} disabled={hasNoError}>
                        <Text>{t('patient_upsert:save_and_wait')}</Text>
                      </Button>
                      <Button success split onPress={() => save('Triage')} disabled={hasNoError}>
                        <Text>{t('patient_upsert:save_and_case')}</Text>
                      </Button>
                    </View>
                  ) : (
                      <LiwiLoader />
                    )
                ) : (
                    <View columns>
                      <Text>{t('work_case:no_algorithm')}</Text>
                    </View>
                  )}
              </View>
            </React.Fragment>
          )}
      </ScrollView>
    );
  }
}
