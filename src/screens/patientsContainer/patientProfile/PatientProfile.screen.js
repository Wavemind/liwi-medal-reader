// @flow
import * as React from 'react';
import moment from 'moment';
import { Button, List, ListItem, Text, View } from 'native-base';
import { LiwiTitle2, SeparatorLine } from '../../../template/layout';
import { routeDependingStatus } from '../../../../frontend_service/constants';
import { getItems } from '../../../engine/api/LocalStorage';
import { styles } from './PatientProfile.style';
import ConfirmationView from '../../../components/ConfirmationView';
import LiwiLoader from '../../../utils/LiwiLoader';

export default class PatientProfile extends React.Component {
  state = {
    patient: {
      medicalCases: [],
    },
    algorithms: [],
    firstRender: false,
  };

  async componentDidMount() {
    await this.getPatient();
  }

  shouldComponentUpdate(nextProps) {
    const { focus } = this.props;

    if (nextProps.focus === 'didFocus' && (focus === undefined || focus === null || focus === 'willBlur')) {
      this.getPatient();
    }
    return true;
  }

  async getPatient() {
    const {
      navigation,
      app: { database },
    } = this.props;
    const id = navigation.getParam('id');

    const patient = await database.findBy('Patient', id);
    const algorithms = await getItems('algorithms');
    this.setState({
      patient,
      algorithms,
      firstRender: true,
    });
  }

  // Select a medical case and redirect to patient's view
  selectMedicalCase = async (medicalCase) => {
    const { setMedicalCase } = this.props;
    await setMedicalCase(medicalCase);
  };

  render() {
    const { patient, algorithms, firstRender } = this.state;

    const {
      navigation,
      app: { t },
    } = this.props;

    const flatPatient = {
      ...patient,
    };
    delete flatPatient.medicalCases;

    // Display list of medical cases
    const _renderMedicalCases = patient.medicalCases.map((medicalCase) => {
      return (
        <ListItem
          key={`${medicalCase.id}_mc`}
          rounded
          block
          style={{ backgroundColor: '#ffffff' }}
          spaced
          onPress={async () => {
            await this.selectMedicalCase({
              ...medicalCase,
              patient: flatPatient,
            });

            const route = routeDependingStatus(medicalCase);
            if (route !== undefined) {
              navigation.navigate(route, {
                idPatient: patient.id,
                newMedicalCase: false,
              });
            }
          }}
        >
          <View w50>
            <Text>{moment(medicalCase.updated_at).format('lll')}</Text>
          </View>
          <View w50>
            <Text>{t(`medical_case:${medicalCase.status}`)}</Text>
          </View>
        </ListItem>
      );
    });

    let first_top_right_question = null;
    let second_top_right_question = null;

    patient.medicalCases.map((mc) => {
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

    return !firstRender ? (
      <LiwiLoader />
    ) : (
      <View padding-auto flex>
        <LiwiTitle2 noBorder>{first_top_right_question !== null ? `${first_top_right_question} ${second_top_right_question}` : patient.id}</LiwiTitle2>

        <SeparatorLine style={styles.bottomMargin} />
        {algorithms.length > 0 ? (
          <View flex>
            <View>
              {patient.medicalCases.length > 0 ? (
                <List block>{_renderMedicalCases}</List>
              ) : (
                <View padding-auto margin-auto>
                  <Text not-available>{t('work_case:no_medical_cases')}</Text>
                </View>
              )}
            </View>
            <View bottom-view>
              <Button
                onPress={() => {
                  navigation.navigate('PatientUpsert', {
                    idPatient: patient.id,
                    newMedicalCase: true,
                  });
                }}
              >
                <Text>{t('work_case:create')}</Text>
              </Button>
            </View>
          </View>
        ) : (
          <View padding-auto margin-auto>
            <Text>{t('work_case:no_algorithm')}</Text>
          </View>
        )}
      </View>
    );
  }
}
