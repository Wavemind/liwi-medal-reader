// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Content, Text, View } from 'native-base';
import { styles } from './ChiefComplaints.style';
import i18n from '../../../../utils/i18n';
import { categories } from '../../../../../frontend_service/constants';
import Boolean from '../../../../components/QuestionsContainer/DisplaysContainer/Boolean';

type Props = NavigationScreenProps & {};

type State = {};

export default class ChiefComplaint extends React.Component<Props, State> {
  // default settings
  state = {
    widthView: 0,
  };

  render() {
    const { medicalCase } = this.props;

    let questions = medicalCase.nodes.filterByCategory(
      categories.chiefComplain
    );

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
              <Boolean widthView={this.state.widthView} question={question} index={i} />
            ))}
          </View>
        ) : (
          <View padding-auto margin-auto>
            <Text not-available>{i18n.t('work_case:no_questions')}</Text>
          </View>
        )}
        <View bottom-view columns>
          <Button light split>
            <Text>{i18n.t('form:back')}</Text>
          </Button>
          <Button light split>
            <Text>{i18n.t('form:next')}</Text>
          </Button>
        </View>
      </Content>
    );
  }
}
