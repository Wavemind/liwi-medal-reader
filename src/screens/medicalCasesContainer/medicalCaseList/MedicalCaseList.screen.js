// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';

import { Button, Icon, Input, Item, List, ListItem, Picker, Text, View } from 'native-base';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import { NavigationScreenProps } from 'react-navigation';
import moment from 'moment';

import { styles } from './MedicalCaseList.style';
import { LiwiTitle2, SeparatorLine } from '../../../template/layout';
import { medicalCaseStatus, routeDependingStatus, toolTipType } from '../../../../frontend_service/constants';
import type { StateApplicationContext } from '../../../engine/contexts/Application.context';
import LiwiLoader from '../../../utils/LiwiLoader';

type Props = NavigationScreenProps & {};
type State = StateApplicationContext & {};

export default class MedicalCaseList extends React.Component<Props, State> {
  state = {
    medicalCases: [],
    orderedFilteredMedicalCases: [],
    searchTerm: '',
    loading: true,
    orderByFirstName: 'asc',
    orderByStatus: null,
    orderByLastName: null,
    orderByUpdate: null,
    filterTerm: '',
    statuses: [medicalCaseStatus.waitingTriage.name, medicalCaseStatus.waitingConsultation.name, medicalCaseStatus.waitingTests.name, medicalCaseStatus.waitingDiagnostic.name],
  };

  async componentDidMount() {
    const {
      app: { database },
    } = this.props;
    this.setState({ loading: true });

    const medicalCases = await database.getAll('MedicalCase');

    this.setState({
      medicalCases,
      loading: false,
    });
  }

  // Update state switch asc / desc
  orderByFirstName = () => {
    const { orderByFirstName } = this.state;
    this.setState(
      {
        orderByStatus: null,
        orderByLastName: null,
        orderByUpdate: null,
        orderByFirstName: orderByFirstName === 'asc' ? 'desc' : 'asc',
      },
      () => this.settleMedicalCase()
    );
  };

  orderByLastName = () => {
    const { orderByLastName } = this.state;
    this.setState(
      {
        orderByStatus: null,
        orderByUpdate: null,
        orderByFirstName: null,
        orderByLastName: orderByLastName === 'asc' ? 'desc' : 'asc',
      },
      () => this.settleMedicalCase()
    );
  };

  // Update state switch asc / desc
  orderByStatus = () => {
    const { orderByStatus } = this.state;
    this.setState(
      {
        orderByFirstName: null,
        orderByLastName: null,
        orderByUpdate: null,
        orderByStatus: orderByStatus === 'asc' ? 'desc' : 'asc',
      },
      () => this.settleMedicalCase()
    );
  };

  orderByUpdate = () => {
    const { orderByUpdate } = this.state;

    this.setState(
      {
        orderByLastName: null,
        orderByFirstName: null,
        orderByUpdate: orderByUpdate === 'asc' ? 'desc' : 'asc',
        orderByStatus: null,
      },
      () => this.settleMedicalCase()
    );
  };

  // Reset all filter by default
  resetFilter = () => {
    this.setState(
      {
        searchTerm: '',
        orderByFirstName: 'asc',
        filterTerm: '',
        orderByUpdate: null,
        orderByLastName: null,
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
    const { medicalCases, searchTerm, orderByFirstName, filterTerm, orderByStatus, orderByUpdate, orderByLastName } = this.state;

    // Filter patient based on first name and last name by search term
    let filteredMedicalCases = filter(medicalCases, (medicalCase) => {
      return medicalCase.patient?.firstname?.toLowerCase().includes(searchTerm?.toLowerCase()) || medicalCase.patient?.lastname?.toLowerCase().includes(searchTerm?.toLowerCase());
    });
    // Filter patient based on medical case status
    filteredMedicalCases = filter(filteredMedicalCases, (medicalCase) => {
      return medicalCase.status === filterTerm || filterTerm === '';
    });
    let orderedFilteredMedicalCases;

    if (orderByFirstName !== null) {
      orderedFilteredMedicalCases = orderBy(filteredMedicalCases, 'patient.firstname', orderByFirstName);
    } else if (orderByLastName !== null) {
      orderedFilteredMedicalCases = orderBy(filteredMedicalCases, 'patient.lastname', orderByLastName);
    } else if (orderByStatus !== null) {
      orderedFilteredMedicalCases = orderBy(filteredMedicalCases, ['status'], [orderByStatus]);
    } else if (orderByUpdate !== null) {
      orderedFilteredMedicalCases = filteredMedicalCases;
      orderedFilteredMedicalCases.sort((a, b) => {
        const dateA = moment(a.updated_at);
        const dateB = moment(b.updated_at);

        if (orderByUpdate === 'asc') {
          return dateB.diff(dateA);
        }
        if (orderByUpdate === 'desc') {
          return dateA.diff(dateB);
        }
      });
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
      navigation,
      app: { t },
      updateModalFromRedux,
    } = this.props;

    const { medicalCases } = this.state;

    return medicalCases.length > 0 ? (
      [
        <List block key="medicalCaseList">
          {medicalCases.map((medicalCase) => {
            let first_top_right_question = null;
            let second_top_right_question = null;
            if (
              medicalCase.first_top_right_question_id !== null &&
              medicalCase.second_top_right_question_id !== null &&
              medicalCase.nodes[medicalCase.first_top_right_question_id]?.value !== null &&
              medicalCase.nodes[medicalCase.second_top_right_question_id]?.value !== null
            ) {
              first_top_right_question = medicalCase.nodes[medicalCase.first_top_right_question_id]?.value;
              second_top_right_question = medicalCase.nodes[medicalCase.second_top_right_question_id]?.value;
            }

            return (
              <ListItem
                rounded
                block
                style={{
                  backgroundColor: '#ffffff',
                }}
                key={`${medicalCase.id}_medical_case_list`}
                spaced
                onPress={async () => {
                  // If medicalCase is open by clinician
                  if (medicalCase.clinician !== null) {
                    updateModalFromRedux({ ...medicalCase }, toolTipType.medicalCaseLocked);
                  } else {
                    await this.selectMedicalCase({
                      ...medicalCase,
                    });

                    const route = routeDependingStatus(medicalCase);

                    if (route !== undefined) {
                      navigation.navigate(route, {
                        idPatient: medicalCase.patient_id,
                        newMedicalCase: false,
                      });
                    }
                  }
                }}
              >
                <View w50>
                  <Text>{first_top_right_question !== null ? `${first_top_right_question} ${second_top_right_question}` : medicalCase.id}</Text>
                </View>
                <View w50>
                  <Text>{t(`medical_case:${medicalCase.status}`)}</Text>
                </View>

                <View w50>
                  <Text>{moment(medicalCase.updated_at).calendar()}</Text>
                </View>
              </ListItem>
            );
          })}
        </List>,
      ]
    ) : (
      <View padding-auto margin-auto>
        <Text not-available>{t('medical_case_list:no_medical_cases')}</Text>
      </View>
    );
  };

  render() {
    const { searchTerm, orderByFirstName, statuses, filterTerm, orderByStatus, loading, orderByUpdate, orderByLastName } = this.state;

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
            <Text style={styles.textFilter}>{t('medical_case_list:waiting')}</Text>
            <Picker style={styles.picker} mode="dropdown" selectedValue={filterTerm} onValueChange={this.filterBy}>
              <Picker.Item label="" value="" />
              {statuses.map((status) => (
                <Picker.Item label={t(`medical_case_list:${status}`)} key={`${status}status_list`} value={status} />
              ))}
            </Picker>
          </View>

          <SeparatorLine />

          <View flex-container-row style={styles.sorted}>
            <Text style={styles.textSorted}>{t('medical_case_list:sort')}</Text>
            <View style={styles.filters}>
              <Button center rounded light onPress={this.orderByFirstName}>
                {orderByFirstName === 'asc' ? <Icon name="arrow-down" /> : <Icon name="arrow-up" />}
                <Text>{t('medical_case_list:name')}</Text>
              </Button>
              <Button center rounded light onPress={this.orderByLastName}>
                {orderByLastName === 'asc' ? <Icon name="arrow-down" /> : <Icon name="arrow-up" />}
                <Text>{t('medical_case_list:surname')}</Text>
              </Button>
              <Button center rounded light onPress={this.orderByStatus}>
                {orderByStatus === 'asc' ? <Icon name="arrow-down" /> : <Icon name="arrow-up" />}
                <Text>{t('medical_case_list:status')}</Text>
              </Button>
              <Button center rounded light onPress={this.orderByUpdate}>
                {orderByUpdate === 'asc' ? <Icon name="arrow-down" /> : <Icon name="arrow-up" />}
                <Text>{t('medical_case_list:update')}</Text>
              </Button>
            </View>
          </View>
          {loading ? <LiwiLoader /> : this._renderMedicalCase()}
        </View>
      </ScrollView>
    );
  }
}
