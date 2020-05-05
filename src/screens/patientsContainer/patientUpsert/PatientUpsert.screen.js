// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, View, Col } from 'native-base';
import { NavigationActions, NavigationScreenProps, StackActions } from 'react-navigation';

import NavigationService from '../../../engine/navigation/Navigation.service';
import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import { MedicalCaseModel } from '../../../../frontend_service/engine/models/MedicalCase.model';
import { LiwiTitle2 } from '../../../template/layout';
import Stepper from '../../../components/Stepper';

import { getItems } from '../../../engine/api/LocalStorage';
import { styles } from './PatientUpsert.style';
import { stages } from '../../../../frontend_service/constants';
import LiwiLoader from '../../../utils/LiwiLoader';
import Questions from '../../../components/QuestionsContainer/Questions';
import CustomInput from '../../../components/InputContainer/CustomInput/index';
import { validatorNavigate } from '../../../engine/navigation/CustomNavigator.navigation';
import uuid from 'react-native-uuid';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientUpsert extends React.Component<Props, State> {
  state = {
    newMedicalCase: true,
    errors: {},
    patient: null,
    loading: true,
    algorithmReady: false,
    otherFacility: null,
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
    const otherFacility = navigation.getParam('otherFacility'); // Object
    const facility = navigation.getParam('facility'); // Object
    const algorithm = await getItems('algorithm');

    if (patientId === null) {
      patient = new PatientModel({ otherFacility, facility });
    } else {
      patient = await database.findBy('Patient', patientId);
    }


    if (newMedicalCase) {
      const generatedMedicalCase = await new MedicalCaseModel({}, algorithm);

      await setMedicalCase({
        ...generatedMedicalCase,
        patient: { ...patient, medicalCases: [] }, // Force
      });
    }

    NavigationService.setParamsAge('Patient');

    this.setState({
      patient,
      algorithmReady: true,
      loading: false,
      newMedicalCase,
    });

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
      updateModalFromRedux,
      app: { database },
    } = this.props;
    const patientId = navigation.getParam('idPatient');
    let isSaved = false;

    await this.setState({ loading: true });

    const validator = validatorNavigate({ type: 'Navigation/NAVIGATE', routeName: 'Triage', params: { initialPage: 0 }, key: 'Triage' });

    if (validator.stepToBeFill[0].isActionValid === false) {
      updateModalFromRedux(null, validator);
    } else {
      updateMedicalCaseProperty('isNewCase', false); // Workaround because redux persist is buggy with boolean
      if (patientId !== null || patientId === undefined) {
        const patient = await database.findBy('Patient', patientId);
        isSaved = patient.addMedicalCase(medicalCase);
        updateMedicalCaseProperty('patient_id', patient.id);
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
      }
    }
    await this.setState({ loading: false });
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
    const { medicalCase, updateMedicalCaseProperty } = this.props;

    // Create patient if there are no errors
    await patient.medicalCases.push(medicalCase);
    await patient.save();
    updateMedicalCaseProperty('patient_id', patient.id);
    return true;
  };

  renderIdentifierData = () => {
    const { patient } = this.state;
    const { t } = this.props.app;
    const { updatePatientValue } = this;

    if (patient === null) {
      return null;
    }

    const { other_uid, other_study_id, other_group_iId } = patient;

    return (
      <View>
        <Text customSubTitle>{t('patient_upsert:facility')}</Text>
        <View w50 style={styles.containerText}>
          <Text style={styles.identifierText}>{t('patient_upsert:uid')}</Text>
          <CustomInput placeholder={'...'} condensed style={styles.identifierText} init={uuid.v4()} change={updatePatientValue} index="uid" autoCapitalize="sentences" />
        </View>
        <View w50 style={styles.containerText}>
          <Text style={styles.identifierText}>{t('patient_upsert:study_id')}</Text>
          <CustomInput placeholder={'...'} condensed style={styles.identifierText} init={patient.study_id} change={updatePatientValue} index="study_id" autoCapitalize="sentences" />
        </View>

        <View w50 style={styles.containerText}>
          <Text style={styles.identifierText}>{t('patient_upsert:group_id')}</Text>
          <CustomInput placeholder={'...'} keyboardType = 'number-pad' condensed style={styles.identifierText} init={patient.group_id} change={updatePatientValue} index="group_id" autoCapitalize="sentences" />
        </View>

        {patient.wasInOtherFacility() && (
          <>
            <View w50 style={styles.containerText}>
              <Text style={styles.identifierText}>{t('patient_upsert:other_uid')}</Text>
              <Text style={styles.identifierText} right>
                {other_uid}
              </Text>
            </View>
            <View w50 style={styles.containerText}>
              <Text style={styles.identifierText}>{t('patient_upsert:other_study_id')}</Text>
              <Text style={styles.identifierText} right>
                {other_study_id}
              </Text>
            </View>
            <View w50 style={styles.containerText}>
              <Text style={styles.identifierText}>{t('patient_upsert:other_group_iId')}</Text>
              <Text style={styles.identifierText} right>
                {other_group_iId}
              </Text>
            </View>
          </>
        )}
      </View>
    );
  };

  render() {
    const { updatePatientValue, save } = this;
    const { patient, errors, loading, algorithmReady, newMedicalCase } = this.state;
    const { navigation } = this.props;

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

    if (medicalCase.nodes !== undefined && medicalCase.metaData.patientupsert.custom.length === 0 && extraQuestions.length !== 0) {
      updateMetaData(
        'patientupsert',
        'custom',
        extraQuestions.map(({ id }) => id)
      );
    }

    return (
      <Stepper
        ref={(ref: any) => {
          this.stepper = ref;
        }}
        validation={false}
        onPageSelected={(e) => {
          navigation.setParams({
            initialPage: e,
          });
        }}
        initialPage={0}
        showBottomStepper={!newMedicalCase}
        icons={[{ name: 'test-tube', type: 'MaterialCommunityIcons' }]}
        steps={[t('medical_case:triage')]}
        backButtonTitle={t('medical_case:back')}
        nextButtonTitle={t('medical_case:next')}
        nextStage="Triage"
        nextStageString={t('navigation:triage')}
      >
        {[
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always" testID="PatientUpsertScreen">
            <LiwiTitle2 noBorder>{t('patient_upsert:title')}</LiwiTitle2>
            {loading ? (
              <LiwiLoader />
            ) : (
                <>
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
                        <>
                          {newMedicalCase && (
                            <View columns>
                              <Button light split onPress={() => save('PatientList')}>
                                <Text>{t('patient_upsert:save_and_wait')}</Text>
                              </Button>
                              <Button success split onPress={() => save('Triage')}>
                                <Text>{t('patient_upsert:save_and_case')}</Text>
                              </Button>
                            </View>
                          )}
                        </>
                      ) : (
                          <LiwiLoader />
                        )
                    ) : (
                        <View columns>
                          <Text>{t('work_case:no_algorithm')}</Text>
                        </View>
                      )}
                  </View>
                </>
              )}
          </ScrollView>,
        ]}
      </Stepper>
    );
  }
}
