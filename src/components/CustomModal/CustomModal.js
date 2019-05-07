import React, { Component } from 'react';
import Modal from 'react-native-modal';
import { TouchableWithoutFeedback } from 'react-native';
import { styles } from './CustomModal.style';
import { Text, View } from 'native-base';

export default class CustomModal extends Component {
  state = {};

  static defaultProps = {
    isModalVisible: false,
  };

  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  render() {
    const { _toggleModal, isModalVisible, content } = this.props;

    return (
      <View style={styles.container}>
        <Modal
          isVisible={isModalVisible}
          backdropOpacity={0.5}
          onSwipeComplete={() => _toggleModal()}
          swipeDirection={'up'}
        >
          <View style={styles.view}>
            <Text>{content}</Text>
            <TouchableWithoutFeedback onPress={() => _toggleModal()}>
              <Text>Hide me!</Text>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </View>
    );
  }
}
