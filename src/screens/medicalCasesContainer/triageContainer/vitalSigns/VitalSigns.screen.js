// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Col, Text, View } from 'native-base';
import { ScrollView } from 'react-native';
import CustomInput from '../../../../components/InputContainer/CustomInput';
import i18n from '../../../../utils/i18n';
import { styles } from './VitalSigns.style';

type Props = NavigationScreenProps & {};

type State = {};

export default class VitalSigns extends React.Component<Props, State> {
  // default settings
  state = {
    vitalSigns: {},
    errors: {},
  };

  async componentWillMount() {
    const {
      medicalCase: {
        vitalSigns
      },
    } = this.props;

    this.setState({ vitalSigns });
  }

  // Update state value of vital signs
  updateVitalSignsValue = async (key, value) => {
    const { vitalSigns } = this.state;
    vitalSigns[key] = value;
    await this.setState({ vitalSigns });
  };

  render() {

    const {
      vitalSigns: {
        temperature,
        heartRate,
        height,
        weight,
        respiratoryRate,
      },
      errors,
    } = this.state;


    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Col>
            <CustomInput
              init={temperature}
              label={i18n.t('vital_signs:first_name')}
              change={this.updateVitalSignsValue}
              index={'temperature'}
              iconName={'user'}
              iconType={'AntDesign'}
              error={errors.temperature}
            />
            <CustomInput
              init={heartRate}
              label={i18n.t('patient:last_name')}
              change={this.updateVitalSignsValue}
              index={'heartRate'}
              iconName={'user'}
              iconType={'AntDesign'}
              error={errors.heartRate}
            />
          </Col>
          <Col>
            <CustomInput
              init={height}
              label={i18n.t('patient:first_name')}
              change={this.updateVitalSignsValue}
              index={'height'}
              iconName={'user'}
              iconType={'AntDesign'}
              error={errors.height}
            />
            <CustomInput
              init={weight}
              label={i18n.t('patient:last_name')}
              change={this.updateVitalSignsValue}
              index={'weight'}
              iconName={'user'}
              iconType={'AntDesign'}
              error={errors.weight}
            />
          </Col>
          <Col>
            <CustomInput
              init={respiratoryRate}
              label={i18n.t('patient:first_name')}
              change={this.updateVitalSignsValue}
              index={'respiratoryRate'}
              iconName={'user'}
              iconType={'AntDesign'}
              error={errors.respiratoryRate}
            />
          </Col>
        </View>

        <View bottom-view>
          <View columns>
            <Button light split>
              <Text>{i18n.t('patient_upsert:save_and_wait')}</Text>
            </Button>
            <Button light split>
              <Text>{i18n.t('patient_upsert:save_and_case')}</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }
}
