// @flow
import React, { Component } from 'react';
import Modal from 'react-native-modal';
import { TouchableWithoutFeedback } from 'react-native';
import { Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './CustomModal.style';
import type { StateApplicationContext } from '../../engine/contexts/Application.context';

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

export default class CustomModal extends Component<Props, State> {
  state = {};

  static defaultProps = {
    isModalVisible: false,
    contentModal: 'Default',
  };

  // eslint-disable-next-line react/no-unused-state
  _toggleModal = () => this.setState(prevVisibility => ({ isModalVisible: !prevVisibility}));

  render() {
    const { app: { isModalVisible, contentModal, set } }= this.props;
    return (
      <View style={styles.container}>
        <Modal
          isVisible={isModalVisible}
          backdropOpacity={0.5}
          onSwipeComplete={() => set('isModalVisible', false)}
          swipeDirection="up"
        >
          <View style={styles.view}>
            <Text>{contentModal}</Text>
            <TouchableWithoutFeedback onPress={() => set('isModalVisible', false)}>
              <Text>Hide</Text>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </View>
    );
  }
}
