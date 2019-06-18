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
  Picker,
  Text,
  View,
} from 'native-base';

import { styles } from './PatientList.style';
import { LiwiTitle2, SeparatorLine } from '../../../template/layout';
import { getArray } from '../../../engine/api/LocalStorage';
import i18n from '../../../utils/i18n';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import merge from 'lodash/merge';
import flatten from 'lodash/flatten';
import includes from 'lodash/includes';
import { medicalCaseStatus } from '../../../../frontend_service/constants';

type Props = {};
type State = {};

export default class PatientList extends React.Component<Props, State> {
  state = {
    medicalCases: [],
    searchTerm: '',
    orderByName: 'asc',
    filterTerm: '',
    isGeneratingPatient: false,
    statuses: [
      medicalCaseStatus.waitingTriage,
      medicalCaseStatus.waitingConsultation,
      medicalCaseStatus.waitingTest,
      medicalCaseStatus.waitingDiagnosis,
    ],
  };

  async componentWillMount() {
    const { navigation } = this.props;

    // Force refresh with a navigation.push
    navigation.addListener('willFocus', async () => {
      await this.filterMedicalCases();
    });
  }

  // Get all medical case with waiting for... status
  filterMedicalCases = async () => {
    const { statuses } = this.state
    let patients = await getArray('patients');
    let medicalCases = [];
    patients.map((patient) => {
      patient.medicalCases.map((medicalCase) => {
        if (includes(statuses, medicalCase.status)) {
          medicalCase.patientId = patient.id;
          medicalCase.firstname = patient.firstname;
          medicalCase.lastname = patient.lastname;
          medicalCases.push(medicalCase);
        }
      });
    });

    this.setState({ medicalCases: medicalCases });
  };

  // Update state switch asc / desc
  orderByName = () => {
    this.setState({
      orderByName: this.state.orderByName === 'asc' ? 'desc' : 'asc',
    });
  };

  // Reset all filter by default
  resetFilter = () => {
    this.setState({
      searchTerm: '',
      orderByName: 'asc',
      filterTerm: '',
    });
  };

  // Filter by status
  filterBy = (filterTerm) => {
    this.setState({ filterTerm });
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
      medicalCases,
      searchTerm,
      orderByName,
      isGeneratingPatient,
      statuses,
      filterTerm,
    } = this.state;
    const { navigation } = this.props;

    // Filter patient based on first name and last name by search term
    let filteredMedicalCases = filter(medicalCases, (medicalCase) => {
      return (
        medicalCase.firstname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        medicalCase.lastname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    // Filter patient based on medical case status
    filteredMedicalCases = filter(filteredMedicalCases, (medicalCase) => {
      return medicalCase.status === filterTerm || filterTerm === '';
    });

    // Order the medical case
    let orderedFilteredMedicalCases = orderBy(
      filteredMedicalCases,
      ['lastname'],
      [orderByName]
    );

    return (
      <ScrollView>
        <View padding-auto>
          <LiwiTitle2 noBorder>{i18n.t('patient_list:search')}</LiwiTitle2>

          <View flex-container-row>
            <Item round style={styles.input}>
              <Icon active name="search" />
              <Input value={searchTerm} onChangeText={this.searchBy} />
            </Item>
            <Button
              center
              rounded
              light
              red
              onPress={this.newPatient}
              disabled={isGeneratingPatient}
            >
              <Icon type={'MaterialCommunityIcons'} name="plus" white />
            </Button>
          </View>

          <View flex-container-row style={styles.filter}>
            <Button center rounded light onPress={this.resetFilter}>
              <Text>{i18n.t('patient_list:all')}</Text>
            </Button>
            <Text style={styles.textFilter}>
              {i18n.t('patient_list:waiting')}
            </Text>
            <Picker
              style={styles.picker}
              mode="dropdown"
              selectedValue={filterTerm}
              onValueChange={this.filterBy}
            >
              <Picker.Item label="" value="" />
              {statuses.map((status, index) => (
                <Picker.Item
                  label={i18n.t(`patient_list:${status}`)}
                  key={index}
                  value={status}
                />
              ))}
            </Picker>
          </View>

          <SeparatorLine />

          <View flex-container-row style={styles.sorted}>
            <Text style={styles.textSorted}>{i18n.t('patient_list:sort')}</Text>
            <Button center rounded light onPress={this.orderByName}>
              {orderByName === 'asc' ? (
                <Icon name="arrow-down" />
              ) : (
                <Icon name="arrow-up" />
              )}
              <Text>{i18n.t('patient_list:name')}</Text>
            </Button>
            <Button center rounded light>
              <Icon name="arrow-down" />
              <Text>{i18n.t('patient_list:status')}</Text>
            </Button>
          </View>

          {medicalCases.length > 0 ? (
            [
              orderedFilteredMedicalCases.length > 0 ? (
                <List block key={'patientList'}>
                  {orderedFilteredMedicalCases.map((medicalCase, index) => (
                    <ListItem
                      rounded
                      block
                      key={index}
                      spaced
                      onPress={() =>
                        navigation.navigate('PatientProfile', {
                          id: medicalCase.patientId,
                        })
                      }
                    >
                      <View w50>
                        <Text>
                          {medicalCase.patientId} : {medicalCase.lastname}{' '}
                          {medicalCase.firstname}
                        </Text>
                      </View>
                      <View w50>
                        <Text>
                          {i18n.t(`medical_case:${medicalCase.status}`)}
                        </Text>
                      </View>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <View padding-auto margin-auto>
                  <Text not-available>{i18n.t('patient_list:not_found')}</Text>
                </View>
              ),
            ]
          ) : (
            <View padding-auto margin-auto>
              <Text not-available>{i18n.t('patient_list:no_patients')}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}
