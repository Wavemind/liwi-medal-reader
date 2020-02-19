// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { Button, Grid, Icon, Text, View } from 'native-base';
import { liwiColors } from '../../../../utils/constants';
import { ColCenter } from '../../../../template/layout';
import { styles } from './Radio.style';

type Props = NavigationScreenProps & {};
type State = {};

export default class Radio extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    const { question } = this.props;
    return nextProps.question.answer !== question.answer;
  }

  render() {
    const { question, setAnswer } = this.props;

    return (
      <View style={styles.view}>
        {Object.keys(question.answers).map((id) => (
          <Grid key={`${id}_radiobutton`}>
            <ColCenter>
              <Text style={{ color: liwiColors.blackColor }}>{question.answers[id].label}</Text>
            </ColCenter>
            <ColCenter>
              <Button square onPress={() => setAnswer(question.id, question.answers[id].id)}>
                <Icon
                  name={question.answer === question.answers[id].id ? 'radio-button-checked' : 'radio-button-unchecked'}
                  type="MaterialIcons"
                  style={question.answer === question.answers[id].id ? { color: liwiColors.greenColor } : { color: liwiColors.blackColor }}
                />
              </Button>
            </ColCenter>
          </Grid>
        ))}
      </View>
    );
  }
}
