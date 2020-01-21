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
  shouldComponentUpdate(nextProps) {
    const {
      app: { isModalVisible },
      modalRedux,
    } = this.props;

    return nextProps.isModalVisible !== isModalVisible || nextProps.modalRedux.open !== modalRedux.open;
  }

  state = {};

  static defaultProps = {
    isModalVisible: false,
    contentModal: 'Default',
  };

  closeModal = () => {
    const {
      app: { isModalVisible, set },
      modalRedux,
      updateModalFromRedux,
    } = this.props;

    const isFromRedux = modalRedux.open;
    const isFromReactContexte = isModalVisible;

    if (isFromRedux) {
      updateModalFromRedux();
    }

    if (isFromReactContexte) {
      set('isModalVisible', false);
    }
  };

  render() {
    const {
      app: { isModalVisible, contentModal },
      modalRedux,
    } = this.props;

    const isFromRedux = modalRedux.open;
    const isFromReactContexte = isModalVisible;
    const isVisible = isFromRedux || isFromReactContexte;

    return (
      <View style={styles.container}>
        <Modal isVisible={isVisible} backdropOpacity={0.5} onSwipeComplete={this.closeModal} swipeDirection="up">
          <View style={[styles.view, isFromRedux && styles.popupAlert]}>
            {isFromReactContexte && <Text>{contentModal}</Text>}
            {isFromRedux && <Text>{modalRedux.content}</Text>}

            <TouchableWithoutFeedback onPress={this.closeModal}>
              <Text>Hide</Text>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </View>
    );
  }
}
