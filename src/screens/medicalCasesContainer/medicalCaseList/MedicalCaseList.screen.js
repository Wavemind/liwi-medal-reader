// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Icon, Input, Item, List, ListItem, Picker, Text, View } from 'native-base';

import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './MedicalCaseList.style';
import { LiwiTitle2, SeparatorLine } from '../../../template/layout';
import { getArray } from '../../../engine/api/LocalStorage';
import { medicalCaseStatus, routeDependingStatus } from '../../../../frontend_service/constants';
import type { StateApplicationContext } from '../../../engine/contexts/Application.context';
import LiwiLoader from '../../../utils/LiwiLoader';

type Props = NavigationScreenProps & {};
type State = StateApplicationContext & {};

export default class MedicalCaseList extends React.Component<Props, State> {
  state = {
    medicalCases: [],
    orderedFilteredMedicalCases: [],
    searchTerm: '',
    loading: false,
    orderByName: 'asc',
    orderByStatus: null,
    filterTerm: '',
    statuses: [
      medicalCaseStatus.waitingTriage.name,
      medicalCaseStatus.waitingConsultation.name,
      medicalCaseStatus.waitingTest.name,
      medicalCaseStatus.waitingDiagnostic.name,
    ],
  };

  async componentWillMount() {
    const { navigation } = this.props;

    // Force refresh with a navigation.push
    navigation.addListener('didFocus', async () => {
      await this.filterMedicalCases();
    });
  }

  // Get all medical case with waiting for... status
  filterMedicalCases = async () => {
    this.setState({ loading: true });
    const { medicalCase } = this.props;

    let patients = await getArray('patients');
    let medicalCases = [];

    patients.map((patient) => {
      patient.medicalCases.map((medicalCaseLocalStorage) => {
        if (medicalCaseLocalStorage.id !== medicalCase.id) {
          medicalCaseLocalStorage.patient = patient;
          medicalCases.push(medicalCaseLocalStorage);
        } else {
          medicalCases.push(medicalCase);
        }
      });
    });

    this.setState(
      {
        medicalCases: medicalCases,
      },
      () => this.settleMedicalCase()
    );
  };

  // Update state switch asc / desc
  orderByName = () => {
    const { orderByName } = this.state;
    this.setState(
      {
        orderByStatus: null,
        orderByName: orderByName === 'asc' ? 'desc' : 'asc',
      },
      () => this.settleMedicalCase()
    );
  };

  // Update state switch asc / desc
  orderByStatus = () => {
    const { orderByStatus } = this.state;
    this.setState(
      {
        orderByName: null,
        orderByStatus: orderByStatus === 'asc' ? 'desc' : 'asc',
      },
      () => this.settleMedicalCase()
    );
  };

  // Reset all filter by default
  resetFilter = () => {
    this.setState(
      {
        searchTerm: '',
        orderByName: 'asc',
        filterTerm: '',
      },
      () => this.settleMedicalCase()
    );
  };

  // Filter by status
  filterBy = (filterTerm) => {
    this.setState({ filterTerm }, () => this.settleMedicalCase());
  };

  // Sets in the  state a list of medical cases based on filters and orders
  settleMedicalCase = () => {
    this.setState({ loading: true });
    const {
      medicalCases,
      searchTerm,
      orderByName,
      filterTerm,
      orderByStatus,
    } = this.state;


    // Filter patient based on first name and last name by search term
    let filteredMedicalCases = filter(medicalCases, (medicalCase) => {

      return (
        medicalCase.patient?.firstname
          ?.toLowerCase()
          .includes(searchTerm?.toLowerCase()) ||
        medicalCase.patient?.lastname
          ?.toLowerCase()
          .includes(searchTerm?.toLowerCase())
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
    this.setState({ orderedFilteredMedicalCases, loading: false });
  };

  // Set string search
  searchBy = (searchTerm) => {
    this.setState({ searchTerm });
  };

  // Select a medical case and redirect to patient's view
  selectMedicalCase = async (medicalCase) => {
    const { setMedicalCase } = this.props;
    await setMedicalCase(medicalCase);
  };

  _renderMedicalCase = () => {
    const {
      app: { t },
    } = this.props;

    const { medicalCase, navigation } = this.props;

    const { orderedFilteredMedicalCases, medicalCases } = this.state;

    return medicalCases.length > 0 ? (
      [
        orderedFilteredMedicalCases.length > 0 ? (
          <List block key="medicalCaseList">
            {orderedFilteredMedicalCases.map((medicalCaseItem) => (
              <ListItem
                rounded
                block
                style={{
                  backgroundColor:
                    medicalCase.id === medicalCaseItem.id
                      ? '#ee0006'
                      : '#ffffff',
                }}
                key={medicalCaseItem.id + '_medical_case_list'}
                spaced
                onPress={async () => {
                  let medicalCaseRoute =
                    medicalCase.id === medicalCaseItem.id
                      ? medicalCase
                      : medicalCaseItem;

                  if (medicalCase.id !== medicalCaseItem.id) {
                    await this.selectMedicalCase({
                      ...medicalCaseItem,
                    });
                  }

                  let route = routeDependingStatus(medicalCaseRoute);
                  if (route !== undefined) {
                    navigation.navigate(route);
                  }
                }}
              >
                <View w50>
                  <Text>
                    {medicalCaseItem.patient.id} :{' '}
                    {medicalCaseItem.patient.lastname}{' '}
                    {medicalCaseItem.patient.firstname}
                  </Text>
                </View>
                <View w50>
                  <Text>
                    {t(
                      `medical_case:${
                        medicalCase.id === medicalCaseItem.id
                          ? medicalCase.status
                          : medicalCaseItem.status
                      }`
                    )}
                  </Text>
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
    );
  };

  render() {
    const {
      searchTerm,
      orderByName,
      statuses,
      filterTerm,
      orderByStatus,
      loading,
    } = this.state;

    const {
      app: { t },
    } = this.props;

    // Order the medical case
    return (
      <ScrollView>
        <View padding-auto>
          <LiwiTitle2 noBorder>{t('medical_case_list:search')}</LiwiTitle2>
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
            <Text style={styles.textFilter}>
              {t('medical_case_list:waiting')}
            </Text>
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
          {loading ? <LiwiLoader /> : this._renderMedicalCase()}
        </View>
      </ScrollView>
    );
  }
}
