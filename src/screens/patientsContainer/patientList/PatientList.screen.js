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
import { getArray, setItem } from '../../../engine/api/LocalStorage';
import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import i18n from '../../../utils/i18n';
import maxBy from 'lodash/maxBy';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

type Props = {};
type State = {};

export default class PatientList extends React.Component<Props, State> {
  state = {
    patients: [],
    search: '',
    orderByName: 'asc',
    isGeneratingPatient: false,
  };

  async componentWillMount() {
    await this.getPatients();
  }

  // get patients in localstorage
  getPatients = async () => {
    let patients = await getArray('patients');
    this.setState({ patients });
  };

  orderByName = () => {
    this.setState({
      orderByName: this.state.orderByName === 'asc' ? 'desc' : 'asc',
    });
  };

  // Generate a new patient based on model Patient
  generatePatient = async () => {
    await this.setState({ isGeneratingPatient: true });
    let patient = new PatientModel();
    await patient.setPatient();
    let patients = this.state.patients;

    // uniqueId incremented
    let maxId = maxBy(patients, 'id');

    if (patients.length === 0) {
      maxId = { id: 0 };
    }

    patient.id = maxId.id + 1;
    patients.push(patient);

    // Set in localstorage
    await setItem('patients', patients);

    // reload patient in the component
    await this.getPatients();
    await this.setState({ isGeneratingPatient: false });
  };

  search = (search) => {
    this.setState({ search });
  };

  render() {
    const { patients, search, orderByName, isGeneratingPatient } = this.state;
    const { navigation } = this.props;

    // filter patient based on firstname and alstname
    let filteredPatients = filter(patients, (p) => {
      return p.firstname.includes(search) || p.lastname.includes(search);
    });

    // order the patients
    let orderedFilteredPatients = orderBy(
      filteredPatients,
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
              <Input value={search} onChangeText={this.search} />
            </Item>
            <Button
              center
              rounded
              light
              red
              onPress={this.generatePatient}
              disabled={isGeneratingPatient}
            >
              <Icon type={'MaterialCommunityIcons'} name="plus" white />
            </Button>
          </View>

          <View flex-container-row style={styles.filter}>
            <Button center rounded light>
              <Text>ALL</Text>
            </Button>
            <Text style={styles.textFilter}>
              {i18n.t('patient_list:waiting')}
            </Text>
            <Picker style={styles.picker} mode="dropdown">
              <Picker.Item label="TRIAGE (11)" value="triage" />
              <Picker.Item label="UNKNOWN (0)" value="unknown" />
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

          {patients.length > 0 ? (
            [
              orderedFilteredPatients.length > 0 ? (
                <List block>
                  {orderedFilteredPatients.map((patient) => (
                    <ListItem
                      rounded
                      block
                      spaced
                      onPress={() =>
                        navigation.navigate('PatientProfile', {
                          id: patient.id,
                        })
                      }
                    >
                      <View w50>
                        <Text>
                          {patient.lastname} {patient.firstname}
                        </Text>
                      </View>
                      <View w50>
                        <Text>{patient.status}</Text>
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
