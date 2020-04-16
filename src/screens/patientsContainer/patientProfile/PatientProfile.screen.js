// @flow
import * as React from 'react';
import { Button, List, ListItem, Text, View } from 'native-base';
import moment from 'moment';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './PatientProfile.style';
import { getItemFromArray, getItems } from '../../../engine/api/LocalStorage';
import { LiwiTitle2, SeparatorLine } from '../../../template/layout';
import LiwiLoader from '../../../utils/LiwiLoader';
import { routeDependingStatus } from '../../../../frontend_service/constants';
import ConfirmationView from '../../../components/ConfirmationView';
import { showBirthDatePatient } from '../../../../frontend_service/algorithm/treeDiagnosis.algo';

export default class PatientProfile extends React.Component {
  state = {
    propsToolTipVisible: false,
    patient: {
      birthdate: '01/01/1900',
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

  // Select a medical case and redirect to patient's view
  selectMedicalCase = async (medicalCase) => {
    const { setMedicalCase } = this.props;
    await setMedicalCase(medicalCase);
  };

  callBackClose = () => {
    this.setState({
      propsToolTipVisible: false,
    });
  };

  render() {
    const { patient, algorithms, firstRender, propsToolTipVisible } = this.state;

    const {
      navigation,
      medicalCase,
      app: { t },
    } = this.props;

    const flatPatient = {
      ...patient,
    };

    delete flatPatient.medicalCases;

    // Display list of medical cases
    const _renderMedicalCases = patient.medicalCases.map((medicalCaseItem) => {
      const { medicalCase } = this.props;

      const style = {
        backgroundColor: '#ffffff',
      };

      return (
        <ListItem
          key={`${medicalCaseItem.id}_mc`}
          rounded
          block
          style={style}
          spaced
          onPress={async () => {
            const medicalCaseRoute = medicalCase.id === medicalCaseItem.id ? medicalCase : medicalCaseItem;

            if (medicalCase.id !== medicalCaseItem.id) {
              await this.selectMedicalCase({
                ...medicalCaseItem,
                patient: flatPatient,
              });
            }

            const route = routeDependingStatus(medicalCaseRoute);
            if (route !== undefined) {
              navigation.navigate(route);
            }
          }}
        >
          <View w50>
            <Text>{moment(medicalCaseItem.createdDate).format('lll')}</Text>
          </View>
          <View w50>
            <Text>{t(`medical_case:${medicalCase.id === medicalCaseItem.id ? medicalCase.status : medicalCaseItem.status}`)}</Text>
          </View>
        </ListItem>
      );
    });

    return !firstRender ? (
      <LiwiLoader />
    ) : (
        <View padding-auto flex>
          <LiwiTitle2 noBorder>
            {patient.firstname} {patient.lastname}
          </LiwiTitle2>
          <Text>
            {showBirthDatePatient(patient, medicalCase)} - {patient.gender}
          </Text>

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
                <ConfirmationView callBackClose={this.callBackClose} propsToolTipVisible={propsToolTipVisible} nextRoute="PatientUpsert" idPatient={patient.id} />
                <Button
                  onPress={() => {
                    if (medicalCase.id === undefined || medicalCase.isNewCase === 'false') {
                      navigation.navigate('PatientUpsert', {
                        idPatient: patient.id,
                        newMedicalCase: true,
                      });
                    } else {
                      this.setState({ propsToolTipVisible: true });
                    }
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
