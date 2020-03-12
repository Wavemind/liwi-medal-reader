// @flow
import React, { Component } from 'react';
import { Content, Text, View, Picker, Button, Icon } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

type Props = NavigationScreenProps & {};
type State = {};
// eslint-disable-next-line react/prefer-stateless-function
export default class MedecinesFormulations extends Component<Props, State> {
  state = { selected: '' };

  onValueChange = (value, diagnoseId, type, drugId) => {
    const { setFormulation } = this.props;
    setFormulation(diagnoseId, value, type, drugId);
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { pageIndex } = this.props;

    if (pageIndex !== undefined && nextProps.selectedPage !== undefined) {
      return nextProps.selectedPage === pageIndex;
    }
    return true;
  }

  static defaultProps = {};

  _renderFormulation = (data, type) => {
    const {
      medicalCase: { nodes },
    } = this.props;

    return Object.keys(data).map((diagnoseId) => {
      return Object.keys(data[diagnoseId].drugs).map((drugId) => {
        const { id } = data[diagnoseId].drugs[drugId];
        if (data[diagnoseId].drugs[drugId].agreed === false) {
          return null;
        }
        return (
          <>
            <Text>{nodes[id]?.label}</Text>
            <Picker
              note
              mode="dropdown"
              style={{ width: 200 }}
              selectedValue={data[diagnoseId]?.drugs[drugId]?.formulationSelected}
              onValueChange={(value) => this.onValueChange(value, diagnoseId, type, drugId)}
            >
              <Picker.Item label={'Please select'} value={null} />
              {nodes[id]?.formulations.map((f) => <Picker.Item label={f.medication_form} value={f.medication_form} />)}
            </Picker>
          </>
        );
      });
    });
  };

  render() {
    const {
      medicalCase: {
        diagnoses: { proposed, additional },
      },
    } = this.props;

    return (
      <View>
        <Text customTitle>Which formulation of medicine is available and appropriate for your patient?</Text>
        {this._renderFormulation(proposed, 'proposed')}
        <Text customTitle> Manually added medicine from dropdown list</Text>
        {this._renderFormulation(additional, 'additional')}
      </View>
    );
  }
}
