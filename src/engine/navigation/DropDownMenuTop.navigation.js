import { Text, View } from 'native-base';
import { CustomPicker } from 'react-native-custom-picker';
import React from 'react';
import { withApplication } from '../../engine/contexts/Application.context';

class DropDownMenu extends React.Component {
  onValueChange = (value: string) => {
    console.log(value);
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
          onValueChange={(value) => {
            // TODO push nav
            console.log(value);
          }}
        />
      </View>
    );
  }
}

export default withApplication(DropDownMenu);
