// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Icon, Text, View } from 'native-base';
import { LeftButton, RightButton } from '../../template/layout';

type Props = NavigationScreenProps & {};

type State = {};

export default class FinalDiagnostic extends React.Component<{}> {
  static defaultProps = {
    findInDiagnoses: {},
  };

  shouldComponentUpdate(nextProps: Props): boolean {
    const {
      id,
      medicalCase: { diagnoses },
    } = this.props;

    return diagnoses.proposed[id]?.agreed !== nextProps.medicalCase.diagnoses.proposed[id]?.agreed;
  }

  _handleClick = (bool) => {
    const { setDiagnoses, id, diagnostic_id, label } = this.props;

    setDiagnoses('proposed', {
      id,
      label,
      diagnostic_id,
      agreed: bool,
    });
  };

  render() {
    const {
      type,
      name,
      style,
      app: { t },
      label,
      id,
      medicalCase: { diagnoses },
    } = this.props;

    return (
      <View style={{ flex: 1, flexDirection: 'row', marginBottom: 5 }}>
        <Text style={{ flex: 0.55 }} size-auto>
          <Icon type={type} name={name} style={style} /> {__DEV__ ? `${id} - ` : null}
          {label}
        </Text>
        <View style={{ flexDirection: 'row', flex: 0.45, height: 50 }}>
          <LeftButton active={diagnoses.proposed[id]?.agreed === true} onPress={() => this._handleClick(true)}>
            <Text white={diagnoses.proposed[id]?.agreed === true} center>
              {t('diagnoses:agree')}
            </Text>
          </LeftButton>
          <RightButton onPress={() => this._handleClick(false)} active={diagnoses.proposed[id]?.agreed === false}>
            <Text center white={diagnoses.proposed[id]?.agreed === false}>
              {t('diagnoses:agree')}
            </Text>
          </RightButton>
        </View>
      </View>
    );
  }
}
