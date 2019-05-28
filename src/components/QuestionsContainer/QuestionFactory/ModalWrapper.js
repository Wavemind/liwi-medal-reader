import * as React from 'react';
import { Button, Text } from 'native-base';
import { liwiColors } from '../../../utils/constants';
import { withApplication } from '../../../engine/contexts/Application.context';

class ModalWrapper extends React.Component {
  static defaultProps = {
    content: 'Modal content',
  };

  _toggleModal = () => this.props.app.setModal(this.props.content);

  render() {
    return (
      <React.Fragment>
        <Button square onPress={this._toggleModal}>
          <Text style={{ color: liwiColors.greyColor }}>?</Text>
        </Button>
      </React.Fragment>
    );
  }
}

export default withApplication(ModalWrapper);
