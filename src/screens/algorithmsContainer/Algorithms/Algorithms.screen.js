// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Button, H2, Icon, Text, View } from 'native-base';
import { ScrollView } from 'react-native';
import moment from 'moment';
import {
  getItem,
  getItems,
  setItem,
  storeMedicalCase,
} from '../../../engine/api/LocalStorage';
import AnimatedPullToRefresh from '../../../components/AnimatedPullToRefresh/AnimatedPullToRefresh';
import { fetchAlgorithms, post } from '../../../../frontend_service/api/Http';
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

    let patients = await getItems('patients');
    let synchronisation = await getItem('synchronisation');
    let algorithms = await getItems('algorithms');

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
    if (
      nextProps.focus === 'didFocus' &&
      (focus === undefined || focus === null || focus === 'willBlur')
    ) {
      this.updateComponentState();
    }
    return true;
  }

  async componentWillMount() {
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
      //
      if (mc.sync_at === null) {
        neverSync++;
      } else {
        if (moment(mc.sync_at) < moment(mc.modify_at)) {
          notSync++;
        } else {
          sync++;
        }
      }
    });

    return (
      <ScrollView>
        {algorithms.map((algorithm) => (
          <CardView
            elevation={5}
            key={algorithm.id + '_algorithm'}
            style={algorithm.selected ? styles.selected : styles.view}
          >
            <H2>{algorithm.name}</H2>
            <Text>versions : {algorithm.versions}</Text>
            <RightView>
              <Button
                disabled
                key={algorithm.versions}
                onPress={() => {
                  navigation.navigate('Algorithm', {
                    algoId: algorithm.algorithm_id,
                    algoVersion: algorithm.version,
                    title: algorithm.name,
                  });
                }}
              >
                <Text>V : {algorithm.version}</Text>
              </Button>
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
              <Text>
                {`${t('algorithms:last')} : ${moment(
                  synchronisation?.time
                ).format()} ${t('algorithms:success')} : ${
                  synchronisation?.success
                }`}
              </Text>
              <View flex-center-row>
                <View w33 style={styles.status}>
                  <Icon
                    type="MaterialIcons"
                    name="sync-disabled"
                    style={styles.icons}
                  />
                  <Text style={styles.number}>{neverSync} </Text>
                  <Text>{t('algorithms:no')}</Text>
                </View>
                <View w33 style={styles.status}>
                  <Icon type="MaterialIcons" name="sync" style={styles.icons} />
                  <Text style={styles.number}>{sync} </Text>
                  <Text>{t('algorithms:uptodate')}</Text>
                </View>
                <View w33 style={styles.status}>
                  <Icon
                    type="MaterialIcons"
                    name="sync-problem"
                    style={styles.icons}
                  />
                  <Text style={styles.number}>{notSync}</Text>
                  <Text>{t('algorithms:need')}</Text>
                </View>
              </View>
              <View flex-center-row>
                <Button style={styles.marginTop} onPress={this.sendSync}>
                  <Text>{t('algorithms:synchronize')}</Text>
                </Button>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  updateAlgorithms = async () => {
    let algorithms = await getItems('algorithms');
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
    await fetchAlgorithms(user.data.id);
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
      app: {
        user: {
          data: { id },
        },
      },
    } = this.props;

    // Store the redux medicalcase before send all data
    await storeMedicalCase(medicalCase);

    let patients = await getItems('patients');
    const body = { patients: patients };
    let resultPosting = await post('sync_medical_cases', body, id);
    let dateNow = moment().format();
    const synchronisation = {
      time: dateNow,
      success: resultPosting,
    };

    patients.map((p) => p.medicalCases.map((mc) => (mc.sync_at = dateNow)));

    // Set date of sync
    await setItem('synchronisation', synchronisation);
    await setItem('patients', patients);
    updateMedicalCaseProperty(dateNow);
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
