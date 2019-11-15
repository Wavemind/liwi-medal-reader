// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { styles } from './ChiefComplaint.style';
import Questions from '../../QuestionsContainer/Questions';

type Props = NavigationScreenProps & {};

type State = {};

export default class ChiefComplaint extends React.Component<Props, State> {
  // default settings
  state = { questions: [] };

  shouldComponentUpdate(nextProps: Props, nextState: State, nextContext: *): boolean {
    let changer = nextState.questions.some((q) => Object.compare(q, this.state.questions.find((d) => d.id === q.id)));
    console.log(changer);
    return nextState.questions.length !== this.state.questions.length || changer;
  }

  componentWillMount(): * {
    this.updateQuestions();
  }

  updateQuestions = () => {
    let questions = [];

    this.props.chiefComplaint[this.props.category].map((q) => {
      if (this.props.medicalCase.nodes[q].counter > 0) {
        questions.push(this.props.medicalCase.nodes[q]);
      }
    });

    this.setState({ questions });
  };

  componentWillUpdate(): * {
    this.updateQuestions();
  }

  render() {
    const { medicalCase, category, chiefComplaint } = this.props;
    const { questions } = this.state;

    console.log(chiefComplaint, chiefComplaint.answer);

    if (chiefComplaint.answer === Number(Object.keys(chiefComplaint.answers).second()) || chiefComplaint.answer === null) {
      return null;
    }

    return (
      <View style={styles.spacingChiefComplaints} key={`chiefComplaint_${chiefComplaint.id}`}>
        <Text customTitle>{chiefComplaint.label}</Text>
        <Questions questions={questions} />
      </View>
    );
  }
}
