// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Content, Text, View } from 'native-base';
import { styles } from './ChiefComplaints.style';
import { categories } from '../../../../../frontend_service/constants';
import Boolean from '../../../../components/QuestionsContainer/DisplaysContainer/Boolean';
import NavigationTriage from '../../../../components/Triage/NavigationTriage';

type Props = NavigationScreenProps & {};

type State = {};

export default class ChiefComplaints extends React.Component<Props, State> {
  state = {
    widthView: 0,
  };

  render() {
    const {
      medicalCase,
      app: { t },
    } = this.props;

    const { widthView } = this.state;
    const orders = medicalCase.triage.orders[categories.chiefComplaint];
    let questions = [];

    orders.map((order) => {
      questions.push(medicalCase.nodes[order]);
    });

    return (
      <Content style={styles.container}>
        {questions.length > 0 ? (
          <View
            flex-container-fluid
            onLayout={async (p) => {
              let w = await p.nativeEvent;
              this.setState({ widthView: w.layout.width });
            }}
          >
            {questions.map((question, i) => (
              <Boolean
                key={question.id + 'chief_boolean'}
                widthView={widthView}
                question={question}
                index={i}
              />
            ))}
          </View>
        ) : (
          <View padding-auto margin-auto>
            <Text not-available>{t('work_case:no_questions')}</Text>
          </View>
        )}
        <NavigationTriage questionsInScreen={questions} />
      </Content>
    );
  }
}
