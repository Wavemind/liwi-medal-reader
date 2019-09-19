// @flow
import * as React from 'react';
import { Button, List, ListItem, Text, View } from 'native-base';
import moment from 'moment';
import type { NavigationScreenProps } from 'react-navigation';
import _ from 'lodash';
import { styles } from './PatientProfile.style';
import { getItemFromArray, getItems } from '../../../engine/api/LocalStorage';
import { LiwiTitle2, SeparatorLine } from '../../../template/layout';
import LiwiLoader from '../../../utils/LiwiLoader';
import { MedicalCaseModel } from '../../../../frontend_service/engine/models/MedicalCase.model';
import { NodesModel } from '../../../../frontend_service/engine/models/Nodes.model';
import { categories } from '../../../../frontend_service/constants';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientProfile extends React.Component<Props, State> {
  state = {
    patient: {
      birthdate: '01/01/1900',
      medicalCases: [],
    },
    algorithms: [],
    isGeneratingMedicalCase: false,
    firstRender: false,
  };

  async componentWillMount() {
    const { navigation } = this.props;
    navigation.addListener('willFocus', async () => {
      await this.getPatient();
    });
  }

  // Get patient data storaged in localstorage
  async getPatient() {
    const { navigation } = this.props;
    let id = navigation.getParam('id');

    let patient = await getItemFromArray('patients', 'id', id);
    let algorithms = await getItems('algorithms');

    this.setState({
      patient,
      algorithms,
      firstRender: true,
    });
  }

  // Generate new medicalCase with algo selected
  generateMedicalCase = async () => {
    const { patient } = this.state;

    await this.setState({
      isGeneratingMedicalCase: true,
    });

    // Get the last medicalcase for question unique vaccines etc
    let lastMedicalCase = _.maxBy(patient.medicalCases, (xyz) => {
      return new Date(xyz.createdDate).getTime();
    });

    let nodes = new NodesModel(lastMedicalCase.nodes);
    let extraQuestions = nodes.filterBy(
      [
        {
          by: 'category',
          operator: 'equal',
          value: categories.chronicalCondition,
        },
        {
          by: 'category',
          operator: 'equal',
          value: categories.vaccine,
        },
        {
          by: 'category',
          operator: 'equal',
          value: categories.demographic,
        },
      ],
      'OR',
      'object'
    );

    let instanceMedicalCase = new MedicalCaseModel();
    await instanceMedicalCase.create(patient.id, extraQuestions);
    await this.getPatient();
    await this.setState({
      isGeneratingMedicalCase: false,
    });
    return false;
  };

  // Select a medical case and redirect to patient's view
  // TODO create a single composant for medicalList Unique in all app !
  selectMedicalCase = async (medicalCase) => {
    const { setMedicalCase, navigation } = this.props;
    await setMedicalCase(medicalCase);

    navigation.navigate('Triage', {
      title: `${medicalCase.patient.firstname} ${medicalCase.patient.lastname}`,
    });
  };

  render() {
    const {
      patient,
      algorithms,
      isGeneratingMedicalCase,
      firstRender,
    } = this.state;

    const {
      navigation,
      app: { t },
    } = this.props;

    const flatPatient = {
      ...patient,
    };
    delete flatPatient.medicalCases;

    // Display list of medical cases
    const _renderMedicalCases = patient.medicalCases.map((medicalCaseItem) => {
      const { medicalCase } = this.props;

      const style = {
        backgroundColor:
          medicalCase.id === medicalCaseItem.id ? '#ee0006' : '#ffffff',
      };

      return (
        <ListItem
          key={medicalCaseItem.id + '_mc'}
          rounded
          block
          style={style}
          spaced
          onPress={async () => {
            if (medicalCase.id !== medicalCaseItem.id) {
              await this.selectMedicalCase({
                ...medicalCaseItem,
                patient: flatPatient,
              });
            }
          }}
        >
          <View w50>
            <Text>{moment(medicalCaseItem.createdDate).format('lll')}</Text>
          </View>
          <View w50>
            <Text>{medicalCaseItem.status}</Text>
          </View>
        </ListItem>
      );
    });

    return !firstRender ? (
      <LiwiLoader />
    ) : (
      <View padding-auto flex>
        <LiwiTitle2 noBorder>
          {patient.firstname} {patient.lastname}
        </LiwiTitle2>
        <Text>
          {moment(patient.birthdate).format('d MMMM YYYY')} - {patient.gender}
        </Text>
        <Button
          onPress={() =>
            navigation.navigate('PatientUpsert', {
              idPatient: patient.id,
            })
          }
        >
          <Text>{t('form:edit')}</Text>
        </Button>
        <SeparatorLine style={styles.bottomMargin} />
        {algorithms.length > 0 ? (
          <View flex>
            <View>
              {patient.medicalCases.length > 0 ? (
                <List block>{_renderMedicalCases}</List>
              ) : (
                <View padding-auto margin-auto>
                  <Text not-available>{t('work_case:no_medical_cases')}</Text>
                </View>
              )}
            </View>
            <View bottom-view>
              <Button
                light
                onPress={() => this.generateMedicalCase()}
                disabled={isGeneratingMedicalCase}
              >
                <Text>{t('work_case:create')}</Text>
              </Button>
            </View>
          </View>
        ) : (
          <View padding-auto margin-auto>
            <Text>{t('work_case:no_algorithms')}</Text>
          </View>
        )}
      </View>
    );
  }
}
