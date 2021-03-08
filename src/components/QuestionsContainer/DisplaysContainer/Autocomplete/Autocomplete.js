// @flow

import * as React from 'react';
import { Text, View, Input } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';

import { styles } from './Autocomplete.style';
import { liwiColors } from '../../../../utils/constants';

export default class String extends React.Component {
  constructor(props) {
    super(props);

    const {
      app: {
        algorithm: { village_json },
      },
      question,
    } = props;

    this.state = {
      style: null,
      query: question.value === null ? '' : question.value,
      villages: village_json,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { question } = this.props;
    const { query } = this.state;
    return nextProps.question.answer !== question.answer || nextProps.question.value !== question.value || query !== nextState.query;
  }

  /**
   * Find village in villages hash
   * @param query
   * @returns {*[]|*}
   */
  findVillage(query) {
    if (query === '') {
      return [];
    }
    const { villages } = this.state;

    const regex = new RegExp(`${query.trim()}`, 'i');
    return villages.filter((village) => {
      return Object.keys(village)[0].search(regex) >= 0;
    }).slice(0,5);
  }

  /**
   * Change color of input on focus
   */
  focus = () =>
    this.setState({
      style: { borderBottomWidth: 1, borderColor: liwiColors.greenColor },
    });

  /**
   * Save value in store
   * @param {String} value
   */
  onEndEditing = (value) => {
    const {
      app: { algorithm, set },
      setAnswer,
      setPatientValue,
      question,
      patientValueEdit,
    } = this.props;

    if (patientValueEdit) {
      if (value !== question.value && value !== '') {
        setPatientValue(question.id, value);
      } else if (question.value !== null && value === '') {
        setPatientValue(question.id, null);
      }
    } else if (value !== question.value && value !== '') {
      setAnswer(algorithm, question.id, value);
    } else if (question.value !== null && value === '') {
      setAnswer(algorithm, question.id, null);
    }

    set('answeredQuestionId', question.id);
    this.setState({ query: value });
  };

  render() {
    const {
      question,
      isReadOnly,
      app: { t, algorithm, algorithmLanguage },
    } = this.props;
    const { style, query } = this.state;

    const villages = this.findVillage(query);

    return (
      <View answer>
        {isReadOnly ? (
          <Input question defaultValue={question.value} style={style} disabled={isReadOnly} />
        ) : (
          <Autocomplete
            data={villages}
            defaultValue={query}
            placeholder={`${t('application:select')} ${algorithm.nodes[question.id].label[algorithmLanguage]}`}
            autoCorrect
            style={styles.autocompleteStyle}
            inputContainerStyle={styles.autocompleteContainer}
            listStyle={styles.autocompleteList}
            onChangeText={(text) => this.setState({ query: text })}
            onEndEditing={(value) => this.onEndEditing(value.nativeEvent.text)}
            renderItem={({ item }) => (
              <TouchableOpacity key={Object.values(item)[0]} style={styles.autocompleteTouchableOpacity} onPress={() => this.onEndEditing(Object.values(item)[0])}>
                <Text style={styles.autocompleteText}>{Object.values(item)[0]}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }
}
