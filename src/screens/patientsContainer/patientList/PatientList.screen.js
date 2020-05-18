// @flow

import * as React from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { Button, Icon, Input, Item, List, ListItem, Text, View, Content, Container } from 'native-base';

import { styles } from './PatientList.style';
import { SeparatorLine } from '../../../template/layout';
import { getItems } from '../../../engine/api/LocalStorage';
import LiwiLoader from '../../../utils/LiwiLoader';
import ConfirmationView from '../../../components/ConfirmationView';
import { liwiColors } from '../../../utils/constants';
import Filter from '../../../components/Filter';

export default class PatientList extends React.Component {
  state = {
    propsToolTipVisible: false,
    loading: false,
    searchTerm: '',
    isGeneratingPatient: false,
    algorithm: null,
    patients: [],
  };

  async componentDidMount() {
    const { navigation } = this.props;
    // Force refresh with a navigation.push
    // navigation.addListener('willFocus', async () => {
    await this.fetchPatients();
    const algorithm = await getItems('algorithm');
    this.setState({ algorithm });
    // });
  }

  /**
   * Fetch patients and algorithm
   * @returns {Promise<void>}
   */
  fetchPatients = async () => {
    const {
      app: { database },
    } = this.props;
    this.setState({ loading: true });

    const patients = await database.getAll('Patient');

    this.setState({
      patients,
      loading: false,
    });
  };

  _renderPatient = (patient) => {
    const { navigation } = this.props;

    let first_top_right_question = null;
    let second_top_right_question = null;

    patient.medicalCases.map((mc) => {
      if (
        mc.first_top_right_question_id !== null &&
        mc.second_top_right_question_id !== null &&
        mc.nodes[mc.first_top_right_question_id]?.value !== null &&
        mc.nodes[mc.second_top_right_question_id]?.value !== null
      ) {
        first_top_right_question = mc.nodes[mc.first_top_right_question_id]?.value;
        second_top_right_question = mc.nodes[mc.second_top_right_question_id]?.value;
      }
    });

    // Faire une division par le nombre de champs a afficher et mettre ce résultat dans le flex

    return (
      <ListItem
        block
        spaced
        white
        key={`${patient.id}_patient_list`}
        onPress={() =>
          navigation.navigate('PatientProfile', {
            id: patient.id,
          })
        }
      >
        <View w33>
          <Text
            size-auto>{first_top_right_question !== null ? `${first_top_right_question} ${second_top_right_question}` : patient.id}</Text>
        </View>
        <View w33>
          <Text
            size-auto>{first_top_right_question !== null ? `${first_top_right_question} ${second_top_right_question}` : patient.id}</Text>
        </View>
        <View w33>
          <Text
            size-auto>{first_top_right_question !== null ? `${first_top_right_question} ${second_top_right_question}` : patient.id}</Text>
        </View>
      </ListItem>
    );
  };

  callBackClose = () => {
    this.setState({
      propsToolTipVisible: false,
    });
  };

  render() {
    const { loading, searchTerm, isGeneratingPatient, algorithm, propsToolTipVisible, patients } = this.state;

    const {
      app: { t },
      navigation,
      medicalCase,
    } = this.props;

    return (
      <Content refreshControl={<RefreshControl refreshing={loading} onRefresh={() => this.fetchPatients()}/>}>
        <View padding-auto flex-container-column>
          <View flex-container-row>
            <Item round style={styles.input}>
              <Icon active name="search"/>
              <Input value={searchTerm} onChangeText={this.searchBy}/>
            </Item>
            <ConfirmationView callBackClose={this.callBackClose} propsToolTipVisible={propsToolTipVisible}
                              nextRoute="PatientUpsert" idPatient={null}
            />
            {algorithm !== null ? (
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
                <Icon type="MaterialCommunityIcons" name="plus" white/>
              </Button>
            ) : null}
          </View>

          <Filter/>

          <SeparatorLine/>

          {patients !== null ? (
            <>
              <View flex-container-row>
                <Button iconRight light style={{ flex: 0.33, backgroundColor: liwiColors.greyColor }}>
                  <Text>Nom</Text>
                  <Icon name="arrow-up"/>
                </Button>
                <Button iconRight light style={{ flex: 0.33, backgroundColor: liwiColors.greyColor }}>
                  <Text>Prénom</Text>
                </Button>
                <Button iconRight light style={{ flex: 0.33, backgroundColor: liwiColors.greyColor }}>
                  <Text>Status</Text>
                </Button>
              </View>
              <List
                block
                key="patientList">
                {patients.map((patient) => this._renderPatient(patient))}
              </List>
            </>
          ) : (
            <View padding-auto margin-auto>
              <Text not-available>{t('patient_list:no_patients')}</Text>
            </View>
          )}
        </View>
      </Content>
    );
  }
}
