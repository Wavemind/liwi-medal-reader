import React, { Component } from 'react';

import { Button, Icon, Text, View } from 'native-base';
import { LeftButton, RightButton } from '../../template/layout';

export default class Medecine extends Component<{}> {
  _handleClick = (boolean) => {
    const { medecine, diagnosesKey, setMedecine, type } = this.props;
    if (boolean !== medecine.agreed) {
      setMedecine(type, diagnosesKey, medecine.id, boolean);
    }
  };

  shouldComponentUpdate(nextProps) {
    const { medecine } = this.props;
    return nextProps.medecine.agreed !== medecine.agreed;
  }

  render() {
    const {
      medecine,
      node,
      app: { t },
    } = this.props;

    return (
      <View style={{ flex: 1, flexDirection: 'row', marginBottom: 5 }}>
        <View style={{ flex: 0.5 }}>
          <Text size-auto>{node?.label}</Text>
          <Text italic>Duration : {medecine.duration} days</Text>
        </View>

        <View style={{ flexDirection: 'row', flex: 0.4, height: 50 }}>
          <LeftButton active={medecine.agreed === true} onPress={() => this._handleClick(true)}>
            <Text white={medecine.agreed === true} center>
              {t('diagnoses:agree')}
            </Text>
          </LeftButton>
          <RightButton onPress={() => this._handleClick(false)} active={medecine.agreed === false}>
            <Text center white={medecine.agreed === false}>
              {t('diagnoses:disagree')}
            </Text>
          </RightButton>
        </View>
        <Button style={{ flex: 0.1 }}>
          <Icon name="block" type="Entypo" style={{ fontSize: 18 }} />
        </Button>
      </View>
    );
  }
}
