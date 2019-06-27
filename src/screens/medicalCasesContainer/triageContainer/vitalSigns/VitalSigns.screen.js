// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Col, Text, View } from 'native-base';
import { ScrollView } from 'react-native';
import CustomInput from '../../../../components/InputContainer/CustomInput';
import i18n from '../../../../utils/i18n';
import { styles } from './VitalSigns.style';
import * as _ from '../../../patientsContainer/patientUpsert/PatientUpsert.screen';

type Props = NavigationScreenProps & {};

type State = {};

export default class VitalSigns extends React.Component<Props, State> {
  // default settings
  state = {
    errors: {},
  };

  // Update state value of vital signs
  updateVitalSignsValue = async (key, value) => {
    const { setVitalSigns } = this.props;
    await setVitalSigns(key, value);
  };

  // Validate input
  validate = async () => {
    const { medicalCase: { vitalSigns } } = this.props;
    let errors = await vitalSigns.validate();
    this.setState({ errors: errors });
  };

  render() {
    const {
      medicalCase: {
        vitalSigns: { temperature, heartRate, height, weight, respiratoryRate },
      },
    } = this.props;
    const { errors } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Col>
            <CustomInput
              init={temperature}
              label={i18n.t('vital_signs:temperature')}
              change={this.updateVitalSignsValue}
              keyboardType={'number-pad'}
              index={'temperature'}
              error={errors.temperature}
            />
            <CustomInput
              init={heartRate}
              label={i18n.t('vital_signs:heart_rate')}
              change={this.updateVitalSignsValue}
              keyboardType={'number-pad'}
              index={'heartRate'}
              error={errors.heartRate}
            />
          </Col>
          <Col>
            <CustomInput
              init={height}
              label={i18n.t('vital_signs:height')}
              change={this.updateVitalSignsValue}
              keyboardType={'number-pad'}
              index={'height'}
              error={errors.height}
            />
            <CustomInput
              init={weight}
              label={i18n.t('vital_signs:weight')}
              change={this.updateVitalSignsValue}
              keyboardType={'number-pad'}
              index={'weight'}
              error={errors.weight}
            />
          </Col>
          <Col>
            <CustomInput
              init={respiratoryRate}
              label={i18n.t('vital_signs:respiratory_rate')}
              change={this.updateVitalSignsValue}
              keyboardType={'number-pad'}
              index={'respiratoryRate'}
              error={errors.respiratoryRate}
            />
          </Col>
        </View>

        <View bottom-view columns>
          <Button light split>
            <Text>{i18n.t('form:back')}</Text>
          </Button>
          <Button light split onPress={this.validate}>
            <Text>{i18n.t('form:next')}</Text>
          </Button>
        </View>
      </ScrollView>
    );
  }
}
