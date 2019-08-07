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

import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import includes from 'lodash/includes';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './MedicalCaseList.style';
import { LiwiTitle2, SeparatorLine } from '../../../template/layout';
import { getArray } from '../../../engine/api/LocalStorage';
import { medicalCaseStatus } from '../../../../frontend_service/constants';
import type { StateApplicationContext } from '../../../engine/contexts/Application.context';

type Props = NavigationScreenProps & {};
type State = StateApplicationContext & {};

export default class MedicalCaseList extends React.Component<Props, State> {
  state = {
    medicalCases: [],
    searchTerm: '',
    orderByName: 'asc',
    orderByStatus: null,
    filterTerm: '',
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
    const { statuses } = this.state;
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

    this.setState({
      medicalCases: medicalCases,
    });
  };

  // Update state switch asc / desc
  orderByName = () => {
    const { orderByName } = this.state;
    this.setState({
      orderByStatus: null,
      orderByName: orderByName === 'asc' ? 'desc' : 'asc',
    });
  };

  // Update state switch asc / desc
  orderByStatus = () => {
    const { orderByStatus } = this.state;
    this.setState({
      orderByName: null,
      orderByStatus: orderByStatus === 'asc' ? 'desc' : 'asc',
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
      statuses,
      filterTerm,
      orderByStatus,
    } = this.state;

    const {
      navigation,
      app: { t },
    } = this.props;

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
    let orderedFilteredMedicalCases;

    if (orderByName !== null) {
      orderedFilteredMedicalCases = orderBy(
        filteredMedicalCases,
        ['lastname'],
        [orderByName]
      );
    } else if (orderByStatus !== null) {
      orderedFilteredMedicalCases = orderBy(
        filteredMedicalCases,
        ['status'],
        [orderByStatus]
      );
    }

    // Order the medical case
    return (
      <ScrollView>
        <View padding-auto>
          <LiwiTitle2 noBorder>
            {t('medical_case_list:search')}
          </LiwiTitle2>
          <View flex-container-row>
            <Item round style={styles.input}>
              <Icon active name="search" />
              <Input value={searchTerm} onChangeText={this.searchBy} />
            </Item>
          </View>
          <View flex-container-row style={styles.filter}>
            <Button center rounded light onPress={this.resetFilter}>
              <Text>{t('medical_case_list:all')}</Text>
            </Button>
            <Text style={styles.textFilter}>{t('medical_case_list:waiting')}</Text>
            <Picker
              style={styles.picker}
              mode="dropdown"
              selectedValue={filterTerm}
              onValueChange={this.filterBy}
            >
              <Picker.Item label="" value="" />
              {statuses.map((status) => (
                <Picker.Item
                  label={t(`medical_case_list:${status}`)}
                  key={status + 'status_list'}
                  value={status}
                />
              ))}
            </Picker>
          </View>

          <SeparatorLine />

          <View flex-container-row style={styles.sorted}>
            <Text style={styles.textSorted}>{t('medical_case_list:sort')}</Text>
            <Button center rounded light onPress={this.orderByName}>
              {orderByName === 'asc' ? (
                <Icon name="arrow-down" />
              ) : (
                <Icon name="arrow-up" />
              )}
              <Text>{t('medical_case_list:name')}</Text>
            </Button>
            <Button center rounded light onPress={this.orderByStatus}>
              {orderByStatus === 'asc' ? (
                <Icon name="arrow-down" />
              ) : (
                <Icon name="arrow-up" />
              )}
              <Text>{t('medical_case_list:status')}</Text>
            </Button>
          </View>
          {medicalCases.length > 0 ? (
            [
              orderedFilteredMedicalCases.length > 0 ? (
                <List block key="medicalCaseList">
                  {orderedFilteredMedicalCases.map((medicalCase) => (
                    <ListItem
                      rounded
                      block
                      key={medicalCase.id + '_medical_case_list'}
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
                        <Text>{t(`medical_case:${medicalCase.status}`)}</Text>
                      </View>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <View padding-auto margin-auto>
                  <Text not-available>{t('medical_case_list:not_found')}</Text>
                </View>
              ),
            ]
          ) : (
            <View padding-auto margin-auto>
              <Text not-available>{t('medical_case_list:no_medical_cases')}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}
