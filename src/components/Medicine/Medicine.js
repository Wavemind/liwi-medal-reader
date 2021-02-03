import React, { Component } from 'react';

import { Text, View } from 'native-base';
import { LeftButton, RightButton } from '../../template/layout';
import { styles } from './Medicine.style';
import { categories } from '../../../frontend_service/constants';

export default class Medicine extends Component {
  _handleClick = (value) => {
    const { medicine, finalDiagnosticId, setMedicine, diagnoseKey, healthCareType } = this.props;
    if (value !== medicine.agreed) {
      setMedicine(diagnoseKey, finalDiagnosticId, medicine.id, value, healthCareType);
    }
  };

  shouldComponentUpdate(nextProps) {
    const { medicine } = this.props;
    return nextProps.medicine.agreed !== medicine.agreed;
  }

  render() {
    const {
      app: { t },
      medicine,
      node,
      healthCareType,
    } = this.props;

    // Auto agree management
    if (healthCareType === 'managements') {
      this._handleClick(true);
    }

    return (
      <>
        <View style={styles.main} margin-top>
          <View style={styles.flex}>
            <Text italic>{node?.label}</Text>
            {node.category === categories.drug ? (
              <Text size-auto>
                {t('drug:d')} : {medicine.duration} {t('drug:days')}
              </Text>
            ) : null}
          </View>

          {healthCareType !== 'managements' && (
            <View style={styles.content}>
              <LeftButton active={medicine.agreed === true} onPress={() => this._handleClick(true)}>
                <Text white={medicine.agreed === true} center style={styles.label}>
                  {t('diagnoses:agree')}
                </Text>
              </LeftButton>
              <RightButton onPress={() => this._handleClick(false)} active={medicine.agreed === false}>
                <Text center white={medicine.agreed === false} style={styles.label}>
                  {t('diagnoses:disagree')}
                </Text>
              </RightButton>
            </View>
          )}
        </View>
        {node?.description !== null && healthCareType === 'drugs' ? (
          <View margin-top>
            <Text size-auto>{node?.description}</Text>
          </View>
        ) : null}
      </>
    );
  }
}
