import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { nodesType } from '../../../../../frontend_service/constants';
import Questions from '../../../../components/QuestionsContainer/Questions';

export default class HealthCaresQuestions extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const { medicalCase } = this.props;
    // eslint-disable-next-line react/prop-types
    const finalDiagnostics = medicalCase.nodes.filterByType(
      nodesType.finalDiagnostic
    );
    const questions = [];

    for (let index in finalDiagnostics) {
      if (finalDiagnostics.hasOwnProperty(index)) {
        let finalDiagnostic = finalDiagnostics[index];
        let condition = finalDiagnostic.calculateCondition();
        if (condition === true) {
          for (let indexManagement in finalDiagnostic.managements) {
            if (finalDiagnostic.managements.hasOwnProperty(indexManagement)) {
              finalDiagnostic.managements[indexManagement].top_conditions.map(
                // eslint-disable-next-line react/prop-types
                (m) => questions[m.first_node_id] = medicalCase.nodes[m.first_node_id]
              );
            }
          }

          for (let indexTreatment in finalDiagnostic.treatments) {
            if (finalDiagnostic.treatments.hasOwnProperty(indexTreatment)) {
              finalDiagnostic.treatments[indexTreatment].top_conditions.map(
                // eslint-disable-next-line react/prop-types
                (t) => questions[t.first_node_id] = medicalCase.nodes[t.first_node_id]
              );
            }
          }
        }
      }
    }

    return (
      <View>
        <Text>HealthCaresQuestions</Text>
        <Questions questions={questions} />
      </View>
    );
  }
}
