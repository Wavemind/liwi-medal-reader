// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Icon, Input, Item, List, ListItem, Text, View } from 'native-base';

import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import includes from 'lodash/includes';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './PatientList.style';
import { LiwiTitle2, SeparatorLine } from '../../../template/layout';
import { getArray, getItems } from '../../../engine/api/LocalStorage';
import type { StateApplicationContext } from '../../../engine/contexts/Application.context';
import { medicalCaseStatus } from '../../../../frontend_service/constants';
import LiwiLoader from '../../../utils/LiwiLoader';
import ConfirmationView from '../../../components/ConfirmationView';
import { showBirthDatePatient } from '../../../../frontend_service/algorithm/treeDiagnosis.algo';

type Props = NavigationScreenProps & {};
type State = StateApplicationContext & {};

export default class PatientList extends React.Component<Props, State> {
  state = {
    patients: [],
    propsToolTipVisible: false,
    loading: false,
    searchTerm: '',
    orderByFirstName: 'asc',
    orderByLastName: null,
    isGeneratingPatient: false,
    algorithms: [],
    statuses: [medicalCaseStatus.close],
  };

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    const { focus } = this.props;
    const { searchTerm } = this.state;

    if ((nextProps.focus === 'didFocus' && (focus === undefined || focus === null)) || nextState.searchTerm !== searchTerm) {
      this.fetchPatients();
    }
    return true;
  }

  async componentDidMount() {
    const { navigation } = this.props;

    // Force refresh with a navigation.push
    navigation.addListener('willFocus', async () => {
      await this.fetchPatients();
    });
  }

  // Get all medical case with waiting for... status
  fetchPatients = async () => {
    this.setState({ loading: true });
    const { statuses } = this.state;
    const patients = await getArray('patients');
    const algorithms = await getItems('algorithms');

    patients.map((patient) => {
      patient.caseInProgress = false;
      patient.medicalCases.map((medicalCase) => {
        if (!includes(statuses, medicalCase.status)) {
          patient.caseInProgress = true;
        }
      });
    });

    this.setState(
      {
        patients,
        algorithms,
      },
      () => this.settlePatients()
    );
  };

  // Update state switch asc / desc
  orderByFirstName = () => {
    const { orderByFirstName } = this.state;
    this.setState(
      {
        orderByFirstName: orderByFirstName === 'asc' ? 'desc' : 'asc',
        orderByLastName: null,
      },
      () => this.settlePatients()
    );
  };

  orderByLastName = () => {
    const { orderByLastName } = this.state;
    this.setState(
      {
        orderByLastName: orderByLastName === 'asc' ? 'desc' : 'asc',
        orderByFirstName: null,
      },
      () => this.settlePatients()
    );
  };

  // Set string search
  searchBy = (searchTerm) => {
    this.setState({ searchTerm }), () => this.settlePatients();
  };

  _renderPatients = () => {
    const {
      navigation,
      app: { t },
      medicalCase,
    } = this.props;

    const { orderedFilteredPatients, patients } = this.state;

    return patients.length > 0 ? (
      [
        orderedFilteredPatients.length > 0 ? (
          <List block key="patientList">
            {orderedFilteredPatients.map((patient) => (
              <ListItem
                rounded
                block
                key={`${patient.id}_patient_list`}
                spaced
                onPress={() =>
                  navigation.navigate('PatientProfile', {
                    id: patient.id,
                  })
                }
              >
                <View w50>
                  <Text>
                    {patient.id} : {patient.lastname} {patient.firstname}
                  </Text>
                </View>
                <View w50>
                  <Text>{showBirthDatePatient(patient, medicalCase)}</Text>
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
    );
  };

  settlePatients = () => {
    this.setState({ loading: true });

    const { patients, searchTerm, orderByFirstName, orderByLastName } = this.state;

    // Filter patient based on first name and last name by search term
    const filteredPatients = filter(patients, (patient) => {
      return patient?.firstname?.toLowerCase().includes(searchTerm?.toLowerCase()) || patient?.lastname?.toLowerCase().includes(searchTerm?.toLowerCase());
    });

    let orderedFilteredPatients;

    if (orderByFirstName !== null) {
      orderedFilteredPatients = orderBy(filteredPatients, ['firstname'], [orderByFirstName]);
    }

    if (orderByLastName !== null) {
      orderedFilteredPatients = orderBy(filteredPatients, ['lastname'], [orderByLastName]);
    }

    this.setState({ orderedFilteredPatients, loading: false });
  };

  callBackClose = () => {
    this.setState({
      propsToolTipVisible: false,
    });
  };

  render() {
    const { loading, searchTerm, orderByFirstName, isGeneratingPatient, algorithms, propsToolTipVisible, orderByLastName } = this.state;

    const {
      app: { t },
      navigation,
      medicalCase,
    } = this.props;

    return (
      <ScrollView>
        <View padding-auto flex-container-column>
          <LiwiTitle2 testID="patient_list" noBorder>
            {t('patient_list:search')}
          </LiwiTitle2>
          <View flex-container-row style={styles.margin}>
            <Item round style={styles.input}>
              <Icon active name="search" />
              <Input value={searchTerm} onChangeText={this.searchBy} />
            </Item>
            <ConfirmationView callBackClose={this.callBackClose} propsToolTipVisible={propsToolTipVisible} nextRoute="PatientUpsert" idPatient={null} />
            {algorithms.length > 0 ? (
              <Button
                testID="create_patient"
                center
                rounded
                light
                red
                onPress={() => {
                  if (medicalCase.id === undefined || medicalCase.isNewCase === 'false') {
                    navigation.navigate('PatientUpsert', {
                      idPatient: null,
                      newMedicalCase: true,
                    });
                  } else {
                    this.setState({ propsToolTipVisible: true });
                  }
                }}
                disabled={isGeneratingPatient}
              >
                <Icon type="MaterialCommunityIcons" name="plus" white />
              </Button>
            ) : null}
          </View>

          <SeparatorLine />

          <View flex-container-row style={styles.sorted}>
            <Text style={styles.textSorted}>{t('patient_list:sort')}</Text>
            <Button center rounded light onPress={this.orderByFirstName}>
              {orderByFirstName === 'asc' ? <Icon name="arrow-down" /> : <Icon name="arrow-up" />}
              <Text>{t('patient_list:name')}</Text>
            </Button>
            <Button center rounded light onPress={this.orderByLastName}>
              {orderByLastName === 'asc' ? <Icon name="arrow-down" /> : <Icon name="arrow-up" />}
              <Text>{t('patient_list:surname')}</Text>
            </Button>
          </View>
          {loading ? <LiwiLoader /> : this._renderPatients()}
        </View>
      </ScrollView>
    );
  }
}
