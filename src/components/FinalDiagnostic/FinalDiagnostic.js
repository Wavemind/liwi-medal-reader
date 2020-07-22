// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { LeftButton, RightButton } from '../../template/layout';
import { styles } from './FinalDiagnostic.style';

type Props = NavigationScreenProps & {};

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
    const { setDiagnoses, id, diagnostic_id, label, drugs, managements } = this.props;

    setDiagnoses('proposed', {
      id,
      label,
      diagnostic_id,
      agreed: bool,
      drugs,
      managements,
    });
  };

  render() {
    const {
      app: { t },
      label,
      id,
      medicalCase: { diagnoses },
    } = this.props;

    return (
      <View style={styles.content}>
        <View style={styles.container}>
          <Text>{label}</Text>
        </View>
        <View style={styles.bloc}>
          <LeftButton active={diagnoses.proposed[id]?.agreed === true} onPress={() => this._handleClick(true)}>
            <Text center white={diagnoses.proposed[id]?.agreed === true}>
              {t('diagnoses:agree')}
            </Text>
          </LeftButton>
          <RightButton onPress={() => this._handleClick(false)} active={diagnoses.proposed[id]?.agreed === false}>
            <Text center white={diagnoses.proposed[id]?.agreed === false}>
              {t('diagnoses:disagree')}
            </Text>
          </RightButton>
        </View>
      </View>
    );
  }
}
