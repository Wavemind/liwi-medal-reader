import React, { Component } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal';
import { Text, View } from 'native-base';
import { liwiColors } from '../../utils/constants';

export default class LiwiModal extends Component {
  state = {};

  static defaultProps = {
    isModalVisible: false,
  };

  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  render() {
    const { _toggleModal, isModalVisible } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Modal
          isVisible={isModalVisible}
          backdropOpacity={0.5}
          onSwipe={() => _toggleModal()}
          swipeDirection={'up'}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: liwiColors.whiteColor,
              padding: 20,
              margin: 20,
            }}
          >
            <Text>f2f3f</Text>
            <Text>Hello!</Text>
            <TouchableWithoutFeedback onPress={() => _toggleModal()}>
              <Text>Hide me!</Text>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </View>
    );
  }
}
