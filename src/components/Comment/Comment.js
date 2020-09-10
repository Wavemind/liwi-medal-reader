// @flow

import * as React from 'react';
import { Button, View, Textarea, Text } from 'native-base';
import { styles } from './Comment.style';
import i18n from '../../utils/i18n';

type Props = NavigationScreenProps & {};

type State = {};

export default class Comment extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      comment: props.comment,
      isEditting: false,
    };
  }

  /**
   * Disable text area + save in redux
   */
  save = () => {
    this.setState({
      isEditting: false,
    });

    this.saveCommentInMedicalCase();
  };

  /**
   * Save comment in state
   * @param value
   */
  handleComment = (value) => {
    this.setState({ comment: value.nativeEvent.text });
  };

  /**
   * Save in redux
   */
  saveCommentInMedicalCase = () => {
    const { updateMedicalCaseProperty } = this.props;
    const { comment } = this.state;
    updateMedicalCaseProperty('comment', comment);
  };

  render() {
    const { comment, isEditting } = this.state;

    return (
      <View>
        {isEditting ? (
          <View>
            <Button style={styles.alignRight} onPress={this.save}>
              <Text>{i18n.t('comment:save')}</Text>
            </Button>
            <Textarea rowSpan={24} value={comment} onChange={this.handleComment} bordered style={styles.activeTextArea} />
          </View>
        ) : (
          <View>
            <Button style={styles.alignRight} onPress={() => this.setState({ isEditting: true })}>
              <Text>{i18n.t('comment:edit')}</Text>
            </Button>
            <Textarea rowSpan={24} value={comment} onChange={this.handleComment} disabled style={styles.disabledTextArea} />
          </View>
        )}
      </View>
    );
  }
}
