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

export default class ChiefComplaint extends React.Component<Props, State> {
  state = {
    widthView: 0,
    questions: [],
  };

  // Fetch first look assessment questions and order it
  componentWillMount() {
    const { medicalCase } = this.props;
    let questions = [];
    const orders = medicalCase.triage_orders[categories.chiefComplaint];

    orders.map((order) => {
      questions.push(medicalCase.nodes[order]);
    });

    this.setState({questions});
  }

  render() {
    const { app: { t } } = this.props;
    const {
      widthView,
      questions,
    } = this.state;

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
              <Boolean key={question.id + 'chief_boolean'} widthView={widthView} question={question} index={i} />
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
