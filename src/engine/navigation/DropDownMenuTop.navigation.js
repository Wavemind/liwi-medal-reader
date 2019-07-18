// @flow
import React from 'react';
import { Text, View } from 'native-base';
import { CustomPicker } from 'react-native-custom-picker';
import { NavigationScreenProps } from 'react-navigation';
import { withApplication } from '../contexts/Application.context';
import type { StateApplicationContext } from '../contexts/Application.context';

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

class DropDownMenu extends React.Component<Props, State> {

  onValueChange = () => {};

  // Render the text on top
  renderField = (settings) => {
    const { selectedItem } = settings;

    return (
      <View>
        <Text>{selectedItem.label}</Text>
      </View>
    );
  };

  render() {
    const {
      app: { t },
    } = this.props;

    const options = [
      { label: t('menu:triage'), value: 'triage' },
      { label: t('menu:consultation'), value: 'Consultation' },
      { label: t('menu:tests'), value: 'Tests' },
      { label: t('menu:strategy'), value: 'Strategy' },
    ];

    return (
      <View flex-center>
        <CustomPicker
          getLabel={(item) => item.label}
          defaultValue={{ label: t('menu:triage'), value: 'triage' }}
          fieldTemplate={this.renderField}
          options={options}
          onValueChange={() => {

          }}
        />
      </View>
    );
  }
}

export default withApplication(DropDownMenu);
