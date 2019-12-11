// @flow
import React from 'react';
import { Text, View } from 'native-base';
import { CustomPicker } from 'react-native-custom-picker';
import { NavigationScreenProps } from 'react-navigation';
import type { StateApplicationContext } from '../contexts/Application.context';
import { withApplication } from '../contexts/Application.context';
import NavigationService from './Navigation.service';

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

class DropDownMenu extends React.Component<Props, State> {
  onValueChange = (selected) => {
    NavigationService.navigate(selected.value);
  };

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
      { label: t('menu:triage'), value: 'Triage' },
      { label: t('menu:consultation'), value: 'Consultation' },
      { label: t('menu:tests'), value: 'Tests' },
      { label: t('menu:strategy'), value: 'Strategy' },
    ];

    let currentRoute = NavigationService.getCurrentRoute();

    let value;

    if (currentRoute.params?.dropDownMenu !== undefined) {
      value = options.find((o) => o.value === currentRoute.params.dropDownMenu);
    }

    return (
      <View flex-center>
        <CustomPicker getLabel={(item) => item.label} value={value} fieldTemplate={this.renderField} options={options} onValueChange={this.onValueChange} />
      </View>
    );
  }
}

export default withApplication(DropDownMenu);
