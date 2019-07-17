// @flow
import { Text, View } from 'native-base';
import { CustomPicker } from 'react-native-custom-picker';
import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { withApplication } from '../contexts/Application.context';
import i18n from '../../utils/i18n';
import type { StateApplicationContext } from '../contexts/Application.context';

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

class DropDownMenu extends React.Component<Props, State> {
  state = {
    options: [
      { label: i18n.t('menu:triage'), value: 'triage' },
      { label: i18n.t('menu:consultation'), value: 'Consultation' },
      { label: i18n.t('menu:tests'), value: 'Tests' },
      { label: i18n.t('menu:strategy'), value: 'Strategy' },
    ],
  };
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
    const { options } = this.state;
    
    return (
      <View flex-center>
        <CustomPicker
          getLabel={(item) => item.label}
          defaultValue={{ label: i18n.t('menu:triage'), value: 'triage' }}
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
