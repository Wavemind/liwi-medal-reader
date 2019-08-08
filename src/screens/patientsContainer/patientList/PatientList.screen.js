// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import {
  Button,
  Icon,
  Input,
  Item,
  List,
  ListItem,
  Text,
  View,
} from 'native-base';

import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import includes from 'lodash/includes';
import moment from 'moment';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './PatientList.style';
import { LiwiTitle2, SeparatorLine } from '../../../template/layout';
import { getArray, getItems } from '../../../engine/api/LocalStorage';
import type { StateApplicationContext } from '../../../engine/contexts/Application.context';
import { medicalCaseStatus } from '../../../../frontend_service/constants';

type Props = NavigationScreenProps & {};
type State = StateApplicationContext & {};

export default class PatientList extends React.Component<Props, State> {
  state = {
    patients: [],
    searchTerm: '',
    orderByName: 'asc',
    isGeneratingPatient: false,
    algorithms: [],
    statuses: [
      medicalCaseStatus.close,
    ],
  };

  async componentWillMount() {
    const { navigation } = this.props;

    // Force refresh with a navigation.push
    navigation.addListener('willFocus', async () => {
      await this.fetchPatients();
    });
  }

  // Get all medical case with waiting for... status
  fetchPatients = async () => {
    const { statuses } = this.state;
    let patients = await getArray('patients');
    let algorithms = await getItems('algorithms');

    patients.map((patient) => {
      patient.caseInProgress = false;
      patient.medicalCases.map((medicalCase) => {
        if (!includes(statuses, medicalCase.status)) {
          patient.caseInProgress = true;
        }
      });
    });

    this.setState({
      patients: patients,
      algorithms: algorithms,
    });
  };

  // Update state switch asc / desc
  orderByName = () => {
    const { orderByName } = this.state;
    this.setState({
      orderByName: orderByName === 'asc' ? 'desc' : 'asc',
    });
  };

  // Generate a new patient based on model Patient
  newPatient = async () => {
    const { navigation } = this.props;
    navigation.navigate('PatientUpsert', { idPatient: null });
  };

  // Set string search
  searchBy = (searchTerm) => {
    this.setState({ searchTerm });
  };

  render() {
    const {
      patients,
      searchTerm,
      orderByName,
      isGeneratingPatient,
      algorithms,
    } = this.state;

    const {
      navigation,
      app: { t },
    } = this.props;

    // Filter patient based on first name and last name by search term
    let filteredPatients = filter(patients, (patient) => {
      return (
        patient.firstname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        patient.lastname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    let orderedFilteredPatients;

    if (orderByName !== null) {
      orderedFilteredPatients = orderBy(
        filteredPatients,
        ['lastname'],
        [orderByName]
      );
    }

    return (
      <ScrollView>
        <View padding-auto>
          <LiwiTitle2 testID="patient_list" noBorder>
            {t('patient_list:search')}
          </LiwiTitle2>
          <View flex-container-row style={styles.marginBottom}>
            <Item round style={styles.input}>
              <Icon active name="search" />
              <Input value={searchTerm} onChangeText={this.searchBy} />
            </Item>
            {algorithms.length > 0 ? (
              <Button
                testID="create_patient"
                center
                rounded
                light
                red
                onPress={this.newPatient}
                disabled={isGeneratingPatient}
              >
                <Icon type="MaterialCommunityIcons" name="plus" white />
              </Button>
            ) : null}
          </View>

          <SeparatorLine />

          <View flex-container-row style={styles.sorted}>
            <Text style={styles.textSorted}>{t('patient_list:sort')}</Text>
            <Button center rounded light onPress={this.orderByName}>
              {orderByName === 'asc' ? (
                <Icon name="arrow-down" />
              ) : (
                <Icon name="arrow-up" />
              )}
              <Text>{t('patient_list:name')}</Text>
            </Button>
          </View>
          {patients.length > 0 ? (
            [
              orderedFilteredPatients.length > 0 ? (
                <List block key="patientList">
                  {orderedFilteredPatients.map((patient) => (
                    <ListItem
                      rounded
                      block
                      key={patient.id + '_patient_list'}
                      spaced
                      onPress={() =>
                        navigation.navigate('PatientProfile', {
                          id: patient.id,
                        })
                      }
                    >
                      <View w50>
                        <Text>
                          {patient.id} : {patient.lastname}{' '}
                          {patient.firstname}
                        </Text>
                      </View>
                      <View w50>
                        <Text>{moment(patient.birthdate).format('ll')}</Text>
                      </View>
                      <View w50>
                        <Text>{patient.caseInProgress ? t('patient_list:case_in_progress') : null}</Text>
                      </View>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <View padding-auto margin-auto>
                  <Text not-available>{t('patient_list:not_found')}</Text>
                </View>
              ),
            ]
          ) : (
            <View padding-auto margin-auto>
              <Text not-available>{t('patient_list:no_patients')}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}
