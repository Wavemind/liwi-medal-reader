// @flow

import * as React from 'react';
import { Button, Grid, Icon, Text, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import { liwiColors } from '../../../../utils/constants';
import { ColCenter } from '../../../../template/layout';

type Props = NavigationScreenProps & {};

type State = {};

export default class Radio extends React.PureComponent<Props, State> {
  state = { style: {}, idClicked: null };

  _handleClick = (idClicked) => this.setState({ idClicked });

  render() {
    const { question } = this.props;
    const { idClicked } = this.state;

    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          borderTopColor: liwiColors.whiteColor,
          borderTopWidth: 2,
        }}
      >
        {Object.keys(question.answers).map((id) => (
          <Grid key={id + '_radiobutton'}>
            <ColCenter>
              <Text style={{ color: liwiColors.blackColor }}>
                {question.answers[id].label}
              </Text>
            </ColCenter>
            <ColCenter>
              <Button
                square
                onPress={() => this._handleClick(question.answers[id].id)}
              >
                <Icon
                  name={
                    idClicked === question.answers[id].id
                      ? 'radio-button-checked'
                      : 'radio-button-unchecked'
                  }
                  type={'MaterialIcons'}
                  style={
                    idClicked === question.answers[id].id
                      ? { color: liwiColors.greenColor }
                      : { color: liwiColors.blackColor }
                  }
                />
              </Button>
            </ColCenter>
          </Grid>
        ))}
      </View>
    );
  }
}
