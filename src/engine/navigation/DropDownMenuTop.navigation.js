import i18n from '../../utils/i18n';
import { Text, View } from 'native-base';
import { CustomPicker } from 'react-native-custom-picker';
import React from 'react';

export class DropDownMenu extends React.Component {
  state = {
    options: [
      { label: i18n.t( 'menu:triage' ), value: 'triage' },
      { label: i18n.t( 'menu:consultation' ), value: 'Consultation' },
      { label: i18n.t( 'menu:tests' ), value: 'Tests' },
      { label: i18n.t( 'menu:strategy' ), value: 'Strategy' },
    ],
  };
  onValueChange = (value: string) => {
    console.log( value );
  };

  renderField = (settings) => {
    const { options } = this.state;
    const { selectedItem, defaultText, getLabel, clear } = settings;

    return (
      <View>
        <Text>{ selectedItem.label }</Text>
      </View>
    );
  };

  render() {
    const { options } = this.state;


    return (
      <View flex-center>
        <CustomPicker
          getLabel={ (item) => item.label }
          defaultValue={ { label: i18n.t( 'menu:triage' ), value: 'triage' } }
          fieldTemplate={ this.renderField }
          options={ options }
          headerTemplate={ this.renderHeader }
          onValueChange={ (value) => {
            console.log( value );
          } }
        />
      </View>
    );
  }
}
