// @flow
import * as React from 'react';
import LottieView from 'lottie-react-native';
import { View } from 'native-base';

type Props = { style?: Object };
type State = {};

export default class LiwiProgressBar extends React.Component<Props, State> {
  state = {};

  static defaultProps = {
    style: {
      width: '100%',
      display: 'flex',
    },
  };

  play = () => {
    this.loading.play();
  };

  reset = () => {
    this.loading.reset();
  };

  render() {
    const { style } = this.props;
    return (
      <View flex-container-row flex-center>
        <LottieView
          ref={(loading) => {
            this.loading = loading;
          }}
          speed={1}
          source={require('./animations/progress_bar.json')}
          style={style}
          loop
          autoPlay
        />
      </View>
    );
  }
}
