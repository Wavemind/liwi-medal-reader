// @flow

import * as React from 'react';
import { Text, View } from 'native-base';
import { LeftButton, RightButton } from '../../template/layout';
import { styles } from './FinalDiagnostic.style';

export default class FinalDiagnostic extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {
      id,
      medicalCase: { diagnoses },
    } = this.props;

    return diagnoses?.proposed[id]?.agreed !== nextProps.medicalCase?.diagnoses?.proposed[id]?.agreed;
  }

  _handleClick = (bool) => {
    const {
      app: { algorithm },
      setDiagnoses,
      id,
      diagnostic_id,
      label,
      drugs,
      managements,
      medicalCase: { diagnoses },
    } = this.props;

    setDiagnoses(algorithm, 'proposed', {
      id,
      label,
      diagnostic_id,
      agreed: bool,
      drugs,
      managements,
    });

    // Remove agreed excluded diagnoses
    algorithm.nodes[id].excluded_final_diagnostics.forEach((diagnosticId) => {
      if (Object.keys(diagnoses.proposed).includes(String(diagnosticId)) && bool) {
        const diagnostic = algorithm.nodes[diagnosticId];
        setDiagnoses(algorithm, 'proposed', {
          id: diagnosticId,
          label: diagnostic.label,
          diagnostic_id: diagnostic.diagnostic_id,
          agreed: false,
          drugs: diagnostic.drugs,
          managements: diagnostic.managements,
        });
      }
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
          <RightButton active={diagnoses.proposed[id]?.agreed === false} onPress={() => this._handleClick(false)}>
            <Text center white={diagnoses.proposed[id]?.agreed === false}>
              {t('diagnoses:disagree')}
            </Text>
          </RightButton>
        </View>
      </View>
    );
  }
}
