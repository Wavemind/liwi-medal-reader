// @flow
import * as React from 'react';
import { View } from 'native-base';
import { Suspense } from 'react';

import { styles } from './Referral.style';
import LiwiLoader from '../../../../utils/LiwiLoader';
import { questionsReferrals } from '../../../../../frontend_service/algorithm/questionsStage.algo';
import Questions from '../../../../components/QuestionsContainer/Questions';

export default class Referral extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.selectedPage === 4;
  }

  render() {
    const {
      app: { algorithm },
      selectedPage,
    } = this.props;

    const questions = questionsReferrals(algorithm);

    return (
      <View style={styles.pad}>
        <Suspense fallback={<LiwiLoader />}>
          <Questions questions={questions} selectedPage={selectedPage} pageIndex={4} />
        </Suspense>
      </View>
    );
  }
}
