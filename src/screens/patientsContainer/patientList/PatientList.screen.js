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

type Props = {};
type State = {};

export default class PatientList extends React.Component<Props, State> {
  state = { patients: [], search: '' };

  async componentWillMount() {
    await this.getPatients();
  }

  getPatients = async () => {
    let patients = await getArray('patients');
    this.setState({ patients });
  };

  generatePatient = async () => {
    let patient = new PatientModel();
    await patient.setPatient();
    let patients = this.state.patients;
    let maxId = maxBy(patients, 'id');

    if (patients.length === 0) {
      maxId = { id: 0 };
    }

    patient.id = maxId.id + 1;
    patients.push(patient);

    await setItem('patients', patients);
    await this.getPatients();
  };

  search = (search) => {
    this.setState({ search });
  };

  render() {
    const { patients, search } = this.state;
    const { navigation } = this.props;

    let filteredPatients = filter(patients, (p) => {
      return p.firstname.includes(search) || p.lastname.includes(search);
    });

    return (
      <ScrollView>
        <View padding-auto>
          <LiwiTitle2 noBorder>{i18n.t('patient_list:search')}</LiwiTitle2>

          <View flex-container-row>
            <Item round style={styles.input}>
              <Icon active name="search" />
              <Input value={search} onChangeText={this.search} />
            </Item>
            <Button center rounded light onPress={this.generatePatient}>
              <Icon type={'MaterialCommunityIcons'} name="plus" />
            </Button>
          </View>

          <View flex-container-row style={styles.filter}>
            <Button center rounded light>
              <Text>ALL</Text>
            </Button>
            <Text style={ styles.textFilter }>{i18n.t('patient_list:waiting')}</Text>
            <Picker style={ styles.picker } mode="dropdown">
              <Picker.Item label="TRIAGE (11)" value="triage"/>
              <Picker.Item label="UNKNOWN (0)" value="unknown"/>
            </Picker>
          </View>

          <SeparatorLine />

          <View flex-container-row style={ styles.sorted }>
            <Text style={ styles.textSorted }>{i18n.t('patient_list:sort')}</Text>
            <Button center rounded light>
              <Icon name="arrow-up"/>
              <Text>{i18n.t('patient_list:name')}</Text>
            </Button>
            <Button center rounded light>
              <Icon name="arrow-down"/>
              <Text>{i18n.t('patient_list:status')}</Text>
            </Button>
          </View>

          {patients.length > 0 ? [
              filteredPatients.length > 0 ? (
            <List block>
              {filteredPatients.map((patient) => (
                <ListItem
                  rounded
                  block
                  spaced
                  onPress={() =>
                    navigation.navigate('PatientProfile', { id: patient.id })
                  }
                >
                  <View w50>
                    <Text>
                      {patient.firstname} {patient.lastname}
                    </Text>
                  </View>
                  <View w50>
                    <Text>{patient.status}</Text>
                  </View>
                </ListItem>
              ))}
            </List>) : (
                <View padding-auto margin-auto>
                  <Text not-available>{i18n.t('patient_list:not_found')}</Text>
                </View>
              )]
          : (
              <View padding-auto margin-auto>
                <Text not-available>{i18n.t('patient_list:no_patients')}</Text>
              </View>
          )}

        </View>
      </ScrollView>
    );
  }
}
