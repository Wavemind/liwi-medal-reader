// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { TouchableOpacity, VirtualizedList, SafeAreaView } from 'react-native';
import { Icon, Text, View } from 'native-base';
import QuestionFactory from '../QuestionFactory';
import { displayFormats, modalType } from '../../../../frontend_service/constants';
import Autocomplete from '../DisplaysContainer/Autocomplete';
import { styles } from '../QuestionFactory/Question.factory.style';
import { ViewQuestion } from '../../../template/layout';

type Props = NavigationScreenProps & {};

type State = {};

export default class Questions extends React.Component<Props, State> {
  state = {};

  shouldComponentUpdate(nextProps: Props): boolean {
    const { pageIndex } = this.props;
    return (pageIndex !== undefined && nextProps.selectedPage === pageIndex) || pageIndex === undefined;
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

  displayQuestion = (question) => {
    const {
      app: { algorithm },
    } = this.props;

    if (algorithm.nodes[question.id].display_format === displayFormats.autocomplete) {
      return (
        <View key={`${question.id}_ref_view`}>
          <View style={styles.flexRow}>
            <View flex={0.12}>
              <TouchableOpacity style={styles.touchable} transparent onPress={() => this.openModal(question.id)}>
                <Icon type="AntDesign" name="info" style={styles.iconInfo} />
              </TouchableOpacity>
            </View>
            <ViewQuestion marginRight={10} marginLeft={0}>
              <Text style={styles.questionLabel} size-auto>
                {algorithm.nodes[question.id].label} {algorithm.nodes[question.id].is_mandatory ? '*' : null}
              </Text>
            </ViewQuestion>
          </View>
          <Autocomplete key={`${question.id}_ref_factory`} question={question} {...this.props} />
        </View>
      );
    }

    return <QuestionFactory question={question} key={`${question.id}_factory`} {...this.props} />;
  };

  render() {
    const {
      questions,
      app: { t },
    } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {Object.keys(questions).length > 0 ? (
          <VirtualizedList
            removeClippedSubviews
            data={questions}
            getItem={(data, index) => data[index]}
            getItemCount={(data) => data.length}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => this.displayQuestion(item)}
          />
        ) : (
          <View padding-auto margin-auto>
            <Text not-available>{t('work_case:no_questions')}</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}
