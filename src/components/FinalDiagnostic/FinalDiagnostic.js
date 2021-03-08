// @flow

import * as React from 'react';
import { Icon, Text, View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { LeftButton, RightButton } from '../../template/layout';
import { styles } from './FinalDiagnostic.style';
import { modalType } from '../../../frontend_service/constants';

export default class FinalDiagnostic extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {
      id,
      medicalCase: { diagnoses },
    } = this.props;

    return diagnoses?.proposed[id]?.agreed !== nextProps.medicalCase?.diagnoses?.proposed[id]?.agreed;
  }

  /**
   * Open redux modal
   */
  openModal = (questionId) => {
    const {
      app: { algorithm },
      updateModalFromRedux,
    } = this.props;

    const currentNode = algorithm.nodes[questionId];
    updateModalFromRedux({ node: currentNode }, modalType.description);
  };

  /**
   * Handles click action
   * @param bool
   * @private
   */
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
      app: { t, algorithmLanguage},
      label,
      id,
      medicalCase: { diagnoses },
    } = this.props;

    // Need this shit when closing a medical otherwise it crash
    if (diagnoses === undefined) {
      return null;
    }

    return (
      <View style={styles.content}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.touchable} transparent onPress={() => this.openModal(id)}>
            <Icon type="AntDesign" name="info" style={styles.iconInfo} />
          </TouchableOpacity>
          <Text>{label[algorithmLanguage]}</Text>
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
