// @flow

import * as React from 'react';
import { View } from 'native-base';
import { Suspense } from 'react';

import { styles } from './BasicMeasurements.style';
import LiwiLoader from '../../utils/LiwiLoader';
import { questionsBasicMeasurements } from '../../../frontend_service/algorithm/questionsStage.algo';
import Questions from '../QuestionsContainer/Questions';

export default class BasicMeasurements extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: props.app.algorithm.is_arm_control ? 1 : 2,
    };
  }

  shouldComponentUpdate(nextProps) {
    const { index } = this.state;

    return nextProps.selectedPage === index;
  }

  render() {
    const {
      app: { algorithm },
      selectedPage,
    } = this.props;
    const { index } = this.state;

    return (
      <View style={styles.pad}>
        <Suspense fallback={<LiwiLoader/>}>
          <Questions questions={questionsBasicMeasurements(algorithm)} selectedPage={selectedPage} pageIndex={index}/>
        </Suspense>
      </View>
    );
  }
}
