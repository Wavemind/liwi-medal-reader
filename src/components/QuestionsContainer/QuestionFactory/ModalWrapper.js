import * as React from 'react';
import { Button, Text } from 'native-base';
import { liwiColors } from '../../../utils/constants';
import Modal from '../../LiwiModal';

export default class ModalWrapper extends React.Component {
  state = { isModalVisible: false };

  static defaultProps = {
    content: 'Modal content',
  };

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  render() {
    return (
      <React.Fragment>
        <Button square onPress={this._toggleModal}>
          <Text style={{ color: liwiColors.greyColor }}>?</Text>
        </Button>
        <Modal
          content={this.props.content}
          _toggleModal={this._toggleModal}
          isModalVisible={this.state.isModalVisible}
        />
      </React.Fragment>
    );
  }
}
