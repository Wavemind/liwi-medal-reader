import { Text, View } from 'native-base';
import { CustomPicker } from 'react-native-custom-picker';
import React from 'react';
import { withApplication } from '../../engine/contexts/Application.context';

class DropDownMenu extends React.Component {
  state = {
    options: [
      { label: this.props.app.t('menu:triage'), value: 'triage' },
      { label: this.props.app.t('menu:consultation'), value: 'Consultation' },
      { label: this.props.app.t('menu:tests'), value: 'Tests' },
      { label: this.props.app.t('menu:strategy'), value: 'Strategy' },
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
