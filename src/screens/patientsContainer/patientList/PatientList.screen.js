// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Icon, Input, Item, List, ListItem, Picker, Text, View } from 'native-base';

import { styles } from './PatientList.style';
import { LiwiTitle2, SeparatorLine } from '../../../template/layout';
import { getArray, setItem } from '../../../engine/api/LocalStorage';
import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import i18n from '../../../utils/i18n';

type Props = {};
type State = {};

export default class PatientList extends React.Component<Props, State> {
  state = { patients: [] };

  async componentWillMount() {
    await this.getPatients();
  }

  getPatients = async () => {
    let patients = await getArray( 'patients' );
    console.log( patients );
    this.setState( { patients } );
  };

  generatePatient = async () => {
    let patient = new PatientModel();
    await patient.setPatient();
    let patients = this.state.patients;
    patients.push( patient );


    await setItem( 'patients', patients );
    await this.getPatients();
  };

  render() {
    const { patients } = this.state;
    const { navigation } = this.props;

    return (
      <ScrollView>
        <View padding-auto>
          <LiwiTitle2 noBorder>Search</LiwiTitle2>

          <View flex-container-row>
            <Item round style={ styles.input }>
              <Icon active name="search"/>
              <Input/>
            </Item>
            <Button center rounded light>
              <Icon type={ 'MaterialCommunityIcons' } name="plus"/>
            </Button>
          </View>

          <View flex-container-row style={ styles.filter }>
            <Button center rounded light>
              <Text>ALL</Text>
            </Button>
            <Text style={ styles.textFilter }>{i18n.t('patient_list:waiting')}</Text>
            <Picker style={ styles.picker } mode="dropdown">
              <Picker.Item label="TRIAGE (11)" value="triage"/>
              <Picker.Item label="UNKNOWN (0)" value="unknown"/>
            </Picker>
          </View>

          <SeparatorLine/>

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

          <Button onPress={ this.generatePatient }>
            <Text>generate patient</Text>
          </Button>

          <List block>
            { patients.map( (patient) => (
              <ListItem
                rounded
                block
                spaced
                onPress={ () =>
                  navigation.navigate( 'PatientProfile', { id: patient.id } )
                }
              >
                <View w50>
                  <Text>
                    { patient.firstname } { patient.lastname }
                  </Text>
                </View>
                <View w50>
                  <Text>{ patient.status }</Text>
                </View>
              </ListItem>
            ) ) }
          </List>
        </View>
      </ScrollView>
    );
  }
}
