// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { Text, View } from 'native-base';
import QuestionFactory from '../QuestionFactory';
import { displayFormats } from '../../../../frontend_service/constants';
import QuestionReference from '../QuestionReference';

type Props = NavigationScreenProps & {};

type State = {};

export default class Questions extends React.Component<Props, State> {
  state = {};

  shouldComponentUpdate(nextProps: Props): boolean {
    const { pageIndex } = this.props;
    return (pageIndex !== undefined && nextProps.selectedPage === pageIndex) || pageIndex === undefined;
  }

  render() {
    const {
      questions,
      app: { t },
    } = this.props;

    return (
      <ScrollView>
        {Object.keys(questions).length > 0 ? (
          Object.keys(questions).map((i) => {
            // Detect Reference node
            if (questions[i].display_format === displayFormats.reference) {
              return <QuestionReference question={questions[i]} key={i + '_ref_factory'} />;
            } else {
              return <QuestionFactory question={questions[i]} key={i + '_factory'} {...this.props} />;
            }
          })
        ) : (
          <View padding-auto margin-auto>
            <Text not-available>{t('work_case:no_questions')}</Text>
          </View>
        )}
      </ScrollView>
    );
  }
}
