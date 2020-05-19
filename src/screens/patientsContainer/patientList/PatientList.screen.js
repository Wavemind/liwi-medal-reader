// @flow

import * as React from 'react';
import { FlatList } from 'react-native';
import { Button, Icon, Input, Item, ListItem, Text, View, ActionSheet } from 'native-base';

import { styles } from './PatientList.style';
import { SeparatorLine } from '../../../template/layout';
import { getItems } from '../../../engine/api/LocalStorage';
import ConfirmationView from '../../../components/ConfirmationView';
import { liwiColors } from '../../../utils/constants';
import Filter from '../../../components/Filter';
import LiwiLoader from "../../../utils/LiwiLoader";

export default class PatientList extends React.Component {
  state = {
    propsToolTipVisible: false,
    loading: false,
    searchTerm: '',
    isGeneratingPatient: false,
    algorithm: null,
    patients: [],
    currentPage: 1,
    isLastBatch: false,
    firstLoading: true,
  };

  constructor() {
    super();
  }

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
    const { currentPage } = this.state;
    this.setState({ loading: true });

    const patients = await database.getAll('Patient', 1);

    this.setState({
      patients,
      currentPage: currentPage + 1,
      loading: false,
      firstLoading: false,
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
        style={{
          paddingLeft: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
          borderRadius: 4,
          height: 80,
          marginRight: 5,
          marginLeft: 5,
          borderWidth: 0,
          paddingTop: 20,
          paddingBottom: 20,
          backgroundColor: liwiColors.whiteDark,
        }}
        key={`${patient.id}_patient_list`}
        onPress={() =>
          navigation.navigate('PatientProfile', {
            id: patient.id,
          })
        }
      >
        <View w33>
          <Text size-auto>{first_top_right_question !== null ? `${first_top_right_question} ${second_top_right_question}` : patient.id}</Text>
        </View>
        <View w33>
          <Text size-auto>{first_top_right_question !== null ? `${first_top_right_question} ${second_top_right_question}` : patient.id}</Text>
        </View>
        <View w33>
          <Text size-auto>{first_top_right_question !== null ? `${first_top_right_question} ${second_top_right_question}` : patient.id}</Text>
        </View>
      </ListItem>
    );
  };

  callBackClose = () => {
    this.setState({
      propsToolTipVisible: false,
    });
  };

  _handleLoadMore = () => {
    const {
      app: { database },
    } = this.props;
    const { patients, currentPage } = this.state;
    this.setState(
      {
        loading: true,
      },
      async () => {
        const newPatients = await database.getAll('Patient', currentPage);
        const isLastBatch = newPatients.length === 0;
        this.setState({
          patients: patients.concat(newPatients),
          currentPage: currentPage + 1,
          isLastBatch,
          loading: false,
        });
      }
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 3,
          width: '100%',
          backgroundColor: liwiColors.lighterGreyColor,
        }}
      />
    );
  };

  renderFooter = () => {
    const {
      app: { t },
    } = this.props;
    const { loading, currentPage, isLastBatch } = this.state;

    if (!loading && currentPage === 1 || isLastBatch) return null;
    return (
      <View margin-auto>
        <Text center>{t('application:loading')}</Text>
      </View>
    );
  };

  render() {
    const { loading, searchTerm, isGeneratingPatient, algorithm, propsToolTipVisible, patients, isLastBatch, firstLoading } = this.state;

    const {
      app: { t },
      navigation,
      medicalCase,
    } = this.props;

    return (
      <>
        <View padding-auto style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <Item style={{
              width: '100%',
              paddingLeft: 10,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,
              elevation: 2,
              borderRadius: 4,
              borderColor: 'transparent',
            }}>
              <Icon active name="search" />
              <Input value={searchTerm} onChangeText={this.searchBy} />
            </Item>
            <ConfirmationView callBackClose={this.callBackClose} propsToolTipVisible={propsToolTipVisible} nextRoute="PatientUpsert" idPatient={null}
            />
          </View>

          <Button
            testID="create_patient"
            full
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
            <Text center size-auto>Add a patient</Text>

          </Button>

          <SeparatorLine />
        </View>

        {firstLoading ? <LiwiLoader/> : patients.length > 0 ? (
          <>
            <View padding-auto style={{ flexDirection: 'row', paddingBottom: 5 }}>
              <Button iconRight center light style={{ flex: 0.33, borderRadius: 5 }}>
                <Text>Nom</Text>
                <Icon name="arrow-up" />
              </Button>
              <Button iconRight center light style={{ flex: 0.33, borderRadius: 5 }}>
                <Text>Prénom</Text>
              </Button>
              <Button iconRight center light style={{ flex: 0.33, borderRadius: 5 }}>
                <Text>Status</Text>
              </Button>
              <Button center red style={{ flex: 0.13, borderRadius: 5, alignSelf: 'flex-end', justifyContent: "center" }} onPress={() => navigation.navigate('Filter')}>
                <Icon type="FontAwesome" name='filter' />
              </Button>
            </View>
            <View padding-auto>
              <FlatList
                key="patientList"
                data={patients}
                refreshing={loading}
                contentContainerStyle={{ paddingBottom: 220 }}
                onRefresh={this.fetchPatients}
                renderItem={(patient) => this._renderPatient(patient.item)}
                onEndReached={({ distanceFromEnd }) => {
                  if (!isLastBatch) {
                    this._handleLoadMore();
                  }
                }}
                onEndReachedThreshold={0.01}
                ItemSeparatorComponent={this.renderSeparator}
                keyExtractor={(patient) => patient.id}
                ListFooterComponent={this.renderFooter}
              />
            </View>
          </>
        ) : (
          <View padding-auto margin-auto>
            <Text not-available>{t('patient_list:no_patients')}</Text>
          </View>
        )}
      </>
    );
  }
}
