// @flow

import * as React from 'react';
import { Input, Picker, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import moment from 'moment';
import { styles } from './Date.style';
import I18n from '../../../../utils/i18n';

type Props = NavigationScreenProps & {};

type State = {};

export default class Date extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { medicalCase } = props;

    const pickerDay = [];
    const pickerMonth = [];

    const dayQuestion = medicalCase.nodes[medicalCase.config.basic_questions.birth_date_day_id];
    const monthQuestion = medicalCase.nodes[medicalCase.config.basic_questions.birth_date_month_id];
    const yearQuestion = medicalCase.nodes[medicalCase.config.basic_questions.birth_date_year_id];

    Object.keys(dayQuestion.answers).map((id) => pickerDay.push(<Picker.Item key={`${id}_picker`} label={dayQuestion.answers[id].label} value={String(id)} />));
    Object.keys(monthQuestion.answers).map((id) => pickerMonth.push(<Picker.Item key={`${id}_picker`} label={monthQuestion.answers[id].label} value={String(id)} />));

    this.state = {
      pickerDay,
      pickerMonth,
      yearValue: yearQuestion.value,
    };
  }

  /**
   * Set date in store
   * @param {Integer} e
   * @private
   */
  onEndEditing = (e) => {
    const value = e.nativeEvent.text;
    const { setAnswer, setPatientValue, patientValueEdit, medicalCase } = this.props;

    const yearQuestion = medicalCase.nodes[medicalCase.config.basic_questions.birth_date_year_id];

    if (patientValueEdit) {
      if (value !== yearQuestion.value && value !== '') {
        setPatientValue(yearQuestion.id, value);
      } else if (yearQuestion.value !== null && value === '') {
        setPatientValue(yearQuestion.id, null);
      }
    } else if (value !== yearQuestion.value && value !== '') {
      setAnswer(yearQuestion.id, value);
    } else if (yearQuestion.value !== null && value === '') {
      setAnswer(yearQuestion.id, null);
    }

    this.setBirthDate();
  };

  /**
   * Set birth date in medical case
   */
  setBirthDate = () => {
    const { medicalCase, setAnswer, setPatientValue, patientValueEdit } = this.props;

    const dayQuestion = medicalCase.nodes[medicalCase.config.basic_questions.birth_date_day_id];
    const monthQuestion = medicalCase.nodes[medicalCase.config.basic_questions.birth_date_month_id];
    const yearQuestion = medicalCase.nodes[medicalCase.config.basic_questions.birth_date_year_id];
    const birthDateQuestion = medicalCase.nodes[medicalCase.config.basic_questions.birth_date_question_id];

    const day = dayQuestion.answer !== null ? dayQuestion.answers[dayQuestion.answer].value : '01';
    const month = monthQuestion.answer !== null ? monthQuestion.answers[monthQuestion.answer].value : '01';

    const birthDate = moment(`${month}/${day}/${yearQuestion.value}`);

    if (patientValueEdit) {
      if (birthDate !== birthDateQuestion.value && birthDate.isValid()) {
        setPatientValue(birthDateQuestion.id, moment(birthDate).format());
      } else if (birthDateQuestion.value !== null && !birthDate.isValid()) {
        setPatientValue(birthDateQuestion.id, null);
        setPatientValue(yearQuestion.id, null);
      }
    } else if (birthDate !== birthDateQuestion.value && birthDate.isValid() && birthDate < moment()) {
      setAnswer(birthDateQuestion.id, moment(birthDate).format());
    } else if ((birthDateQuestion.value !== null && !birthDate.isValid()) || birthDate > moment()) {
      setAnswer(birthDateQuestion.id, null);
      setAnswer(yearQuestion.id, null);
      this.setState({ yearValue: null });
    }
  };

  /**
   * Set value in store
   * @param {Integer} questionId
   * @param {String} value
   */
  onValueChange = (questionId, value) => {
    const { setAnswer, setPatientValue, patientValueEdit } = this.props;

    if (patientValueEdit) {
      setPatientValue(questionId, value);
    } else {
      setAnswer(questionId, value);
    }

    this.setBirthDate();
  };

  /**
   * Check if there is no unpermitted char
   * @param {Event} e
   */
  onChange = (e) => {
    let value = e.nativeEvent.text;

    const regWithComma = /^[0-9,]+$/;

    // Replace comma with dot
    if (regWithComma.test(value)) {
      value = value.replace(',', '.');
    }

    // Remove char that are not number or dot
    value = value.replace(/[^0-9.]/g, '');

    // Parse to float if value is not empty and last char is not dot
    if (value !== '' && value.charAt(value.length - 1) !== '.') {
      value = parseFloat(value);
    }

    this.setState({ yearValue: value });
  };

  render() {
    const { isReadOnly, medicalCase } = this.props;
    const { yearValue, pickerDay, pickerMonth } = this.state;

    const dayQuestion = medicalCase.nodes[medicalCase.config.basic_questions.birth_date_day_id];
    const monthQuestion = medicalCase.nodes[medicalCase.config.basic_questions.birth_date_month_id];

    return (
      <View>
        <Picker mode="dropdown" style={styles.picker} selectedValue={String(dayQuestion.answer)} onValueChange={(value) => this.onValueChange(dayQuestion.id, value)} enable={isReadOnly}>
          <Picker.Item label={I18n.t('patient:days')} value={null} />
          {pickerDay}
        </Picker>

        <Picker mode="dropdown" style={styles.picker} selectedValue={String(monthQuestion.answer)} onValueChange={(value) => this.onValueChange(monthQuestion.id, value)} enable={isReadOnly}>
          <Picker.Item label={I18n.t('patient:months')} value={null} />
          {pickerMonth}
        </Picker>

        <Input
          keyboardType="number-pad"
          placeholder={I18n.t('patient:year')}
          yearQuestion
          numeric
          value={yearValue}
          style={styles.inputStyle}
          onChange={this.onChange}
          onEndEditing={this.onEndEditing}
          disabled={isReadOnly}
        />
      </View>
    );
  }
}
