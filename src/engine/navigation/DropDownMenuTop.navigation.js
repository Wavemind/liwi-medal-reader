import i18n from '../../utils/i18n';
import { Text, View } from 'native-base';
import { CustomPicker } from 'react-native-custom-picker';
import React from 'react';
import { withApplication } from '../../engine/contexts/Application.context';

class DropDownMenu extends React.Component {
  state = {
    options: [
      { label: i18n.t('menu:triage'), value: 'triage' },
      { label: i18n.t('menu:consultation'), value: 'Consultation' },
      { label: i18n.t('menu:tests'), value: 'Tests' },
      { label: i18n.t('menu:strategy'), value: 'Strategy' },
    ],
  };
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
    const { options } = this.state;
    const {
      app: { t },
    } = this.props;

    return (
      <View flex-center>
        <CustomPicker
          getLabel={(item) => item.label}
          defaultValue={{ label: i18n.t('menu:triage'), value: 'triage' }}
          fieldTemplate={this.renderField}
          options={options}
          onValueChange={(value) => {
            console.log(value);
          }}
        />
      </View>
    );
  }
}

export default withApplication(DropDownMenu);
