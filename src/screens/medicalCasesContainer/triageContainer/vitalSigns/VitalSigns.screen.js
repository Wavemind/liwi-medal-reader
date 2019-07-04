// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Col, Text, View } from 'native-base';
import { ScrollView } from 'react-native';
import CustomInput from '../../../../components/InputContainer/CustomInput';
import { styles } from './VitalSigns.style';

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

  render() {
    const {
      medicalCase: {
        vitalSigns: { temperature, heartRate, height, weight, respiratoryRate },
      },
    } = this.props;
    const { errors } = this.state;

    const { app: { t }} = this.props;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Col>
            <CustomInput
              init={temperature}
              label={t('vital_signs:temperature')}
              change={this.updateVitalSignsValue}
              keyboardType={'number-pad'}
              index={'temperature'}
              error={errors.temperature}
            />
            <CustomInput
              init={heartRate}
              label={t('vital_signs:heart_rate')}
              change={this.updateVitalSignsValue}
              keyboardType={'number-pad'}
              index={'heartRate'}
              error={errors.heartRate}
            />
          </Col>
          <Col>
            <CustomInput
              init={height}
              label={t('vital_signs:height')}
              change={this.updateVitalSignsValue}
              keyboardType={'number-pad'}
              index={'height'}
              error={errors.height}
            />
            <CustomInput
              init={weight}
              label={t('vital_signs:weight')}
              change={this.updateVitalSignsValue}
              keyboardType={'number-pad'}
              index={'weight'}
              error={errors.weight}
            />
          </Col>
          <Col>
            <CustomInput
              init={respiratoryRate}
              label={t('vital_signs:respiratory_rate')}
              change={this.updateVitalSignsValue}
              keyboardType={'number-pad'}
              index={'respiratoryRate'}
              error={errors.respiratoryRate}
            />
          </Col>
        </View>

        <View bottom-view columns>
          <Button light split>
            <Text>{t('form:back')}</Text>
          </Button>
          <Button light split onPress={this.save}>
            <Text>{t('form:next')}</Text>
          </Button>
        </View>
      </ScrollView>
    );
  }
}
