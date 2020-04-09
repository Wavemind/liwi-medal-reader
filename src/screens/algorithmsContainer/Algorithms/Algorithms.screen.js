// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Button, H2, Icon, Text, View } from 'native-base';
import { ScrollView } from 'react-native';
import moment from 'moment';
import { getItem, getItems, setItem, storeMedicalCase } from '../../../engine/api/LocalStorage';
import AnimatedPullToRefresh from '../../../components/AnimatedPullToRefresh/AnimatedPullToRefresh';
import { fetchAlgorithms, syncMedicalCases } from '../../../../frontend_service/api/Http';
import { styles } from './Algorithms.style';
import { CardView, LiwiTitle4, RightView } from '../../../template/layout';
import LiwiLoader from '../../../utils/LiwiLoader';

type Props = NavigationScreenProps & {};
type State = { algorithms: Array<Object> };

export default class Algorithms extends React.Component<Props, State> {
  state = {
    algorithms: [],
    isRefreshing: false,
    synchronisation: null,
    medicalCases: [],
    ready: false,
  };

  updateComponentState = async () => {
    const { ready } = this.state;
    if (ready === true) {
      this.setState({ ready: false });
    }

    const { medicalCase: reduxMedicalCase } = this.props;

    const patients = await getItems('patients');
    const synchronisation = await getItem('synchronisation');
    const algorithms = await getItems('algorithms');

    const medicalCases = [];

    patients.map((patient) =>
      patient.medicalCases.map((mc) => {
        if (reduxMedicalCase.id === mc.id) {
          medicalCases.push(reduxMedicalCase);
        } else {
          medicalCases.push(mc);
        }
      })
    );

    this.setState({
      synchronisation,
      medicalCases,
      algorithms,
      ready: true,
    });
  };

  shouldComponentUpdate(nextProps: Props): boolean {
    const { focus } = this.props;
    if (nextProps.focus === 'didFocus' && (focus === undefined || focus === null || focus === 'willBlur')) {
      this.updateComponentState();
    }
    return true;
  }

  async componentDidMount() {
    await this.updateComponentState();
  }

  contentView = () => {
    const { synchronisation, medicalCases, algorithms } = this.state;
    const {
      app: { t },
      navigation,
    } = this.props;

    let notSync = 0;
    let sync = 0;
    let neverSync = 0;

    medicalCases.map((mc) => {
      if (mc.synchronized_at === null) {
        neverSync++;
      } else if (moment(mc.updated_at) > moment(mc.synchronized_at)) {
        notSync++;
      } else {
        sync++;
      }
    });

    return (
      <ScrollView>
        {algorithms.map((algorithm) => (
          <CardView elevation={5} key={`${algorithm.id}_algorithm`} style={algorithm.selected ? styles.selected : styles.view}>
            <H2>{algorithm.algorithm_name}</H2>
            <RightView>
              <Text> : {algorithm.version_name}</Text>
            </RightView>
          </CardView>
        ))}
        {algorithms.length === 0 ? (
          <CardView elevation={5} key="_algo" style={styles.view}>
            <Text>Aucun algorithme</Text>
          </CardView>
        ) : null}

        <View style={styles.smallContent}>
          <LiwiTitle4>{t('algorithms:titlesync')}</LiwiTitle4>
          {synchronisation === null ? (
            <Text>{t('algorithms:never')}</Text>
          ) : (
            <View style={{ flex: 1 }}>
              <Text>{`${t('algorithms:last')} : ${moment(synchronisation.time).format('MMMM Do YYYY, h:mm:ss a')}`}</Text>
              <Text style={styles.red}>{synchronisation.success ? t('algorithms:success') : t('algorithms:nosuccess')} </Text>
              <View flex-center-row>
                <View w33 style={styles.status}>
                  <Icon type="MaterialIcons" name="sync-disabled" style={styles.icons} />
                  <Text style={styles.number}>{neverSync} </Text>
                  <Text>{t('algorithms:no')}</Text>
                </View>
                <View w33 style={styles.status}>
                  <Icon type="MaterialIcons" name="sync" style={styles.icons} />
                  <Text style={styles.number}>{sync} </Text>
                  <Text>{t('algorithms:uptdate')}</Text>
                </View>
                <View w33 style={styles.status}>
                  <Icon type="MaterialIcons" name="sync-problem" style={styles.icons} />
                  <Text style={styles.number}>{notSync}</Text>
                  <Text>{t('algorithms:need')}</Text>
                </View>
              </View>
            </View>
          )}
          <View flex-center-row>
            <Button style={styles.marginTop} onPress={this.sendSync}>
              <Text>{t('algorithms:synchronize')}</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  };

  updateAlgorithms = async () => {
    const algorithms = await getItems('algorithms');
    this.setState({
      algorithms,
    });
  };

  // Fetch algorithms from server and save it in local storage
  onRefresh = async () => {
    this.setState({ isRefreshing: true });
    const {
      app: { user },
    } = this.props;

    await fetchAlgorithms();
    await this.updateAlgorithms();
    this.setState({ isRefreshing: false });
  };

  componentWillReceiveProps = async (nextProps) => {
    if (nextProps.focus === 'didFocus') {
      await this.updateComponentState();
    }
  };

  sendSync = async () => {
    this.setState({ ready: false });
    const {
      medicalCase,
      updateMedicalCaseProperty,
      app: { user },
    } = this.props;

    // Store the redux medicalcase before send all data
    await storeMedicalCase(medicalCase);

    const patients = await getItems('patients');
    const body = { patients };
    const resultPosting = await syncMedicalCases(body, user?.data?.id);
    const dateNow = moment().format();
    if (resultPosting !== false) {
      // Do stuff on result
      patients.map((patient) => {
        // Set id from server
        if (patient.main_data_patient_id === null) {
          patient.main_data_patient_id = resultPosting.patients[patient.id];
        }
        patient.medicalCases.map((medicalCaseitem) => {
          if (medicalCase.id === medicalCaseitem.id) {
            updateMedicalCaseProperty('main_data_medical_case_id', resultPosting.medical_cases[medicalCaseitem.id]);
          }
          // Set id from server
          if (medicalCaseitem.main_data_medical_case_id === null) {
            medicalCaseitem.main_data_medical_case_id = resultPosting.medical_cases[medicalCaseitem.id];
          }
          // Update Sync_at
          medicalCaseitem.synchronized_at = dateNow;
        });
      });
      await setItem('patients', patients);
      updateMedicalCaseProperty('synchronized_at', dateNow);
    }

    const synchronisation = {
      time: dateNow,
      success: resultPosting !== false,
    };

    // Set date of sync
    await setItem('synchronisation', synchronisation);
    await this.updateComponentState();
  };

  render() {
    const { isRefreshing, ready } = this.state;
    const { focus } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {!ready && focus === 'didFocus' ? (
            <LiwiLoader />
          ) : (
            <AnimatedPullToRefresh
              isRefreshing={isRefreshing}
              onRefresh={this.onRefresh}
              pullHeight={100}
              contentView={this.contentView()}
              onPullAnimationSrc={require('../../../utils/animations/medical.json')}
              onStartRefreshAnimationSrc={require('../../../utils/animations/medical.json')}
              onRefreshAnimationSrc={require('../../../utils/animations/medical.json')}
              onEndRefreshAnimationSrc={require('../../../utils/animations/medical.json')}
            />
          )}
        </View>
      </View>
    );
  }
}
