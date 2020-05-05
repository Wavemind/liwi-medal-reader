// @flow
import React, { Component } from "react";
import Modal from "react-native-modal";
import { TouchableWithoutFeedback } from "react-native";
import { Text, View } from "native-base";
import { NavigationScreenProps } from "react-navigation";
import { styles } from "./CustomModal.style";
import type { StateApplicationContext } from "../../engine/contexts/Application.context";

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

export default class CustomModal extends Component<Props, State> {
  state = {};

  static defaultProps = {
    isModalVisible: false,
    contentModal: 'Default',
  };

  closeModal = () => {
    const {
      app: { set },
    } = this.props;

    set('isModalVisible', false);
  };

  render() {
    const {
      app: { isModalVisible, contentModal },
    } = this.props;

    return (
      <View style={styles.container}>
        <Modal isVisible={isModalVisible} backdropOpacity={0.5} onSwipeComplete={this.closeModal} swipeDirection="up">
          <View style={[styles.view]}>
            <Text>{contentModal}</Text>

            <TouchableWithoutFeedback onPress={this.closeModal}>
              <Text>Hide</Text>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </View>
    );
  }
}
