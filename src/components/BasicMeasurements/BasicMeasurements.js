// @flow

import * as React from 'react';
import { View } from 'native-base';
import { Suspense } from 'react';

import { styles } from './BasicMeasurements.style';
import LiwiLoader from '../../utils/LiwiLoader';
import { questionsBasicMeasurements } from '../../../frontend_service/algorithm/questionsStage.algo';
import Questions from '../QuestionsContainer/Questions';

export default class BasicMeasurements extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.selectedPage === 1;
  }

  render() {
    const {
      app: { algorithm },
      selectedPage,
    } = this.props;

    return (
      <View style={styles.pad}>
        <Suspense fallback={<LiwiLoader />}>
          <Questions questions={questionsBasicMeasurements(algorithm)} selectedPage={selectedPage} pageIndex={1} />
        </Suspense>
      </View>
    );
  }
}
