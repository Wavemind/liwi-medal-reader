// @flow

import * as React from 'react';
import { Button, View, Textarea, Text } from 'native-base';
import { styles } from './Comment.style';
import i18n from '../../utils/i18n';

export default class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: props.comment,
      isEditing: false,
    };
  }

  /**
   * Disable text area + save in redux
   */
  save = () => {
    this.setState({
      isEditing: false,
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
    const {
      app: { t },
    } = this.props;
    const { comment, isEditing } = this.state;

    return (
      <View style={styles.pad}>
        <Text style={styles.text}>{t('diagnoses:consultation_comment')}</Text>
        {isEditing ? (
          <View>
            <Button style={styles.alignRight} onPress={this.save}>
              <Text>{i18n.t('comment:save')}</Text>
            </Button>
            <Textarea rowSpan={24} value={comment} onChange={this.handleComment} bordered style={styles.activeTextArea} />
          </View>
        ) : (
          <View>
            <Button style={styles.alignRight} onPress={() => this.setState({ isEditing: true })}>
              <Text>{i18n.t('comment:edit')}</Text>
            </Button>
            <Textarea rowSpan={24} value={comment} onChange={this.handleComment} disabled style={styles.disabledTextArea} />
          </View>
        )}
      </View>
    );
  }
}
