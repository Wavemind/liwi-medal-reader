// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Icon, ListItem, Text, View } from 'native-base';
import QuestionFactory from '../QuestionFactory';
import { displayFormats, modalType } from '../../../../frontend_service/constants';
import QuestionReference from '../QuestionReference';
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

  render() {
    const {
      questions,
      app: { t, algorithm },
    } = this.props;

    return (
      <ScrollView>
        {Object.keys(questions).length > 0 ? (
          Object.keys(questions).map((i) => {
            // Detect Reference node
            if (algorithm.nodes[questions[i].id].display_format === displayFormats.reference) {
              return <QuestionReference question={questions[i]} key={`${i}_ref_factory`} />;
            }

            if (algorithm.nodes[questions[i].id].display_format === displayFormats.autocomplete) {
              return (
                <>
                  <View style={styles.flexRow}>
                    <View flex={0.12}>
                      <TouchableOpacity style={styles.touchable} transparent onPress={() => this.openModal(questions[i].id)}>
                        <Icon type="AntDesign" name="info" style={styles.iconInfo} />
                      </TouchableOpacity>
                    </View>
                    <ViewQuestion marginRight={10} marginLeft={0}>
                      <Text style={styles.questionLabel} size-auto>
                        {algorithm.nodes[questions[i].id].label} {algorithm.nodes[questions[i].id].is_mandatory ? '*' : null}
                      </Text>
                    </ViewQuestion>
                  </View>
                  <Autocomplete question={questions[i]} {...this.props} />
                </>
              );
            }

            return <QuestionFactory question={questions[i]} key={`${i}_factory`} {...this.props} />;
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
