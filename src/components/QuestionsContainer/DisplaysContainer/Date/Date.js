// @flow

import * as React from 'react';
import { Input, Picker, View } from 'native-base';
import * as _ from 'lodash';
import moment from 'moment';
import { styles } from './Date.style';
import I18n from '../../../../utils/i18n';

export default class Date extends React.Component {
  constructor(props) {
    super(props);

    const { question } = props;

    const pickerDay = [];
    const pickerMonth = [];
    const pickerYear = [];
    let dayValue = null;
    let monthValue = null;
    let yearValue = null;

    if (question.value !== null) {
      const momentDate = moment(question.value, 'YYYY-MM-DD');
      dayValue = momentDate.format('D');
      monthValue = momentDate.format('M');
      yearValue = momentDate.format('YYYY');
    }

    _.range(1, 32).map((day) => pickerDay.push(<Picker.Item key={`${day}_day_picker`} label={String(day)} value={String(day)} />));
    _.range(1, 13).map((month) => pickerMonth.push(<Picker.Item key={`${month}_month_picker`} label={String(month)} value={String(month)} />));
    _.range(moment().year() - 18, moment().year() + 1).map((year) => pickerYear.push(<Picker.Item key={`${year}_year_picker`} label={String(year)} value={String(year)} />));

    this.state = {
      pickerDay,
      pickerMonth,
      pickerYear,
      dayValue,
      monthValue,
      yearValue,
    };

    // Due to possible change in patient value. Force update to calculate background_calculation like age in days
    if (question.value !== null) {
      this.setBirthDate();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { dayValue, monthValue, yearValue } = this.state;
    const { question } = this.props;

    return question.value !== nextProps.question.value || dayValue !== nextState.dayValue || monthValue !== nextState.monthValue || yearValue !== nextState.yearValue;
  }

  /**
   * Set birth date in medical case
   */
  setBirthDate = () => {
    const { dayValue, monthValue, yearValue } = this.state;
    const {
      app: { algorithm, set },
      question,
      setAnswer,
      setPatientValue,
      patientValueEdit,
    } = this.props;

    if (yearValue !== null) {
      const birthDateQuestion = question;
      const day = dayValue !== null ? dayValue : '1';
      const month = monthValue !== null ? monthValue : '1';

      const birthDate = moment(`${yearValue}-${month}-${day}`, 'YYYY-MM-DD');

      if (patientValueEdit) {
        if (birthDate !== birthDateQuestion.value && birthDate.isValid() && birthDate < moment()) {
          setPatientValue(birthDateQuestion.id, moment(birthDate).format());
        } else if ((birthDateQuestion.value !== null && !birthDate.isValid()) || birthDate >= moment()) {
          setPatientValue(birthDateQuestion.id, null);
        }
      } else if (birthDate !== birthDateQuestion.value && birthDate.isValid() && birthDate < moment()) {
        setAnswer(algorithm, birthDateQuestion.id, moment(birthDate).format());
      } else if ((birthDateQuestion.value !== null && !birthDate.isValid()) || birthDate >= moment()) {
        setAnswer(algorithm, birthDateQuestion.id, null);
        this.setState({ dayValue: null, monthValue: null, yearValue: null });
      }
      set('answeredQuestionId', question.id);
    }
  };

  /**
   * Set value in state
   * @param {String} key
   * @param {String} value
   */
  onValueChange = async (key, value) => {
    await this.setState({ [key]: value });
    this.setBirthDate();
  };

  render() {
    const { isReadOnly, question } = this.props;
    const { dayValue, monthValue, yearValue, pickerDay, pickerMonth, pickerYear } = this.state;

    return (
      <View>
        {isReadOnly ? (
          <Input question defaultValue={moment(question.value).format('DD/MM/YYYY')} disabled={isReadOnly} />
        ) : (
          <>
            <Picker mode="dropdown" style={styles.picker} selectedValue={String(dayValue)} onValueChange={(value) => this.onValueChange('dayValue', value)}>
              <Picker.Item label={I18n.t('patient:days')} value={null} />
              {pickerDay}
            </Picker>

            <Picker mode="dropdown" style={styles.picker} selectedValue={String(monthValue)} onValueChange={(value) => this.onValueChange('monthValue', value)}>
              <Picker.Item label={I18n.t('patient:months')} value={null} />
              {pickerMonth}
            </Picker>

            <Picker mode="dropdown" style={styles.picker} selectedValue={String(yearValue)} onValueChange={(value) => this.onValueChange('yearValue', value)}>
              <Picker.Item label={I18n.t('patient:year')} value={null} />
              {pickerYear}
            </Picker>
          </>
        )}
      </View>
    );
  }
}
