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
    const {
      app: { algorithm },
    } = this.props;
    return nextProps.selectedPage === algorithm.is_arm_control ? 2 : 4;
  }

  render() {
    const {
      app: { algorithm },
      selectedPage,
      medicalCase,
    } = this.props;

    // Need this shit when closing a medical otherwise it crash
    if (medicalCase.id === undefined) {
      return null;
    }

    const questions = questionsReferrals(algorithm);

    return (
      <View style={styles.pad}>
        <Suspense fallback={<LiwiLoader />}>
          <Questions questions={questions} selectedPage={selectedPage} pageIndex={algorithm.is_arm_control ? 2 : 4} />
        </Suspense>
      </View>
    );
  }
}
