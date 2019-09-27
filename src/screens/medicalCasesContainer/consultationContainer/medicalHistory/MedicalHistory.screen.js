// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { categories, stage } from '../../../../../frontend_service/constants';
import QuestionsPerChiefComplaint from '../../../../components/Consultation/QuestionsPerChiefComplaint';
import NavigationTriage from '../../../../components/Triage/NavigationTriage';

type Props = NavigationScreenProps & {};

type State = {};

export default class MedicalHistory extends React.Component<Props, State> {
  // default settings
  state = {};

  render() {
    return (
      <React.Fragment>
        <QuestionsPerChiefComplaint
          filterBy={[
            { by: 'category', operator: 'equal', value: categories.symptom },
            { by: 'stage', operator: 'equal', value: stage.consultation },
            { by: 'counter', operator: 'more', value: 0 },
          ]}
        />
        <NavigationTriage />
      </React.Fragment>
    );
  }
}
