// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Icon, Input, Item, List, ListItem, Text, View } from 'native-base';

import { styles } from './PatientList.style';
import { LiwiTitle2, SeparatorLine } from '../../../template/layout';
import { getItems } from '../../../engine/api/LocalStorage';
import LiwiLoader from '../../../utils/LiwiLoader';
import ConfirmationView from '../../../components/ConfirmationView';

export default class PatientList extends React.Component {
  state = {
    propsToolTipVisible: false,
    loading: false,
    searchTerm: '',
    isGeneratingPatient: false,
    algorithms: [],
    patients: [],
  };

  async componentDidMount() {
    const { navigation } = this.props;
    // Force refresh with a navigation.push
    navigation.addListener('willFocus', async () => {
      await this.fetchPatients();
    });
  }

  // Get all medical case with waiting for... status
  fetchPatients = async () => {
    const {
      app: { database },
    } = this.props;
    this.setState({ loading: true });

    const patients = await database.getAll('Patient');
    const algorithms = await getItems('algorithms');
    this.setState({
      algorithms,
      patients,
      loading: false,
    });
  };

  _renderPatient = (patient) => {
    const {
      navigation,
      app: { t },
    } = this.props;

    let first_top_right_question = null;
    let second_top_right_question = null;

    patient.medicalCases.map((mc) => {
      console.log(mc, mc.first_top_right_question_id !== null, mc.second_top_right_question_id !== null);
      if (
        mc.first_top_right_question_id !== null &&
        mc.second_top_right_question_id !== null &&
        mc.nodes[mc.first_top_right_question_id].value !== null &&
        mc.nodes[mc.second_top_right_question_id].value !== null
      ) {
        first_top_right_question = mc.nodes[mc.first_top_right_question_id].value;
        second_top_right_question = mc.nodes[mc.second_top_right_question_id].value;
      }
    });

    return (
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
          <Text>{first_top_right_question !== null ? `${first_top_right_question} ${second_top_right_question}` : patient.id}</Text>
        </View>
      </ListItem>
    );
  };

  _renderPatients = () => {
    const {
      navigation,
      app: { t },
    } = this.props;

    const { patients } = this.state;

    return patients.length > 0 ? (
      <List block key="patientList">
        {patients.map((patient) => this._renderPatient(patient))}
      </List>
    ) : (
      <View padding-auto margin-auto>
        <Text not-available>{t('patient_list:no_patients')}</Text>
      </View>
    );
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
            <Button disabled center rounded light onPress={this.orderByFirstName}>
              {orderByFirstName === 'asc' ? <Icon name="arrow-down" /> : <Icon name="arrow-up" />}
              <Text>{t('patient_list:name')}</Text>
            </Button>
            <Button disabled center rounded light onPress={this.orderByLastName}>
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
