import * as React from 'react';
import LottieView from 'lottie-react-native';
import { Button, H3, Text,View } from 'native-base';

type Props = {};
type State = {};

export default class LiwiLoader extends React.Component<Props, State> {
  state = {};

  static defaultProps = {
    style: {
      height: 100,
      width: 100,
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
    return (
      <View flex-container-row flex-center>
        <LottieView
          ref={(loading) => {
            this.loading = loading;
          }}
          speed={3}
          source={require('./animations/loading.json')}
          style={this.props.style}
          loop
          autoPlay={true}
        />
      </View>
    );
  }
}
