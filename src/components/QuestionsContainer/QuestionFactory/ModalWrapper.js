// @flow
import * as React from 'react';
import { Button, Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { liwiColors } from '../../../utils/constants';
import { withApplication } from '../../../engine/contexts/Application.context';
import type { StateApplicationContext } from '../../../engine/contexts/Application.context';

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

class ModalWrapper extends React.Component<Props, State> {

  static defaultProps = {
    content: 'Modal content',
  };

  // One-liner
  // eslint-disable-next-line react/destructuring-assignment
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
