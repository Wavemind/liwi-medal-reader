// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Content, Text, View } from 'native-base';
import { styles } from './ChiefComplaints.style';
import i18n from '../../../../utils/i18n';
import { categories } from '../../../../../frontend_service/constants';

type Props = NavigationScreenProps & {};

type State = {};

export default class ChiefComplaint extends React.Component<Props, State> {
  // default settings
  state = {
    widthView: 0,
  };

  _renderButton = (question, index) => {
    const { widthView } = this.state;

    // onlayout isn't set
    if (widthView === 0) {
      return null;
    }

    const margin = 15;
    const sizeButton = Math.floor(widthView / 3 - margin * 1.33);

    const mod = index % 3;
    let styleMargin = {};
    if (mod === 0) {
      styleMargin = {
        marginTop: margin,
        marginBottom: 0,
        marginLeft: margin,
        marginRight: 0,
      };
    } else if (mod === 1) {
      styleMargin = {
        marginTop: margin,
        marginBottom: 0,
        marginLeft: margin,
        marginRight: margin,
      };
    } else if (mod === 2) {
      styleMargin = {
        marginTop: margin,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: margin,
      };
    }

    return (
      <Button
        onPress={() => {}}
        style={Object.assign(
          {
            width: sizeButton,
            justifyContent: 'center',
            height: sizeButton,
          },
          styleMargin
        )}
        light
      >
        <Text center>{question.label}</Text>
      </Button>
    );
  };

  render() {
    const { medicalCase } = this.props;

    let questions = medicalCase.nodes.filterByCategory(
      categories.chiefComplain
    );

    return (
      <Content style={styles.container}>
        {questions.length > 0 ? (
          <View
            flex-container-fluid
            onLayout={async (p) => {
              let w = await p.nativeEvent;
              this.setState({ widthView: w.layout.width });
            }}
          >
            {questions.map((question, i) => this._renderButton(question, i))}
          </View>
        ) : (
          <View padding-auto margin-auto>
            <Text not-available>{i18n.t('work_case:no_questions')}</Text>
          </View>
        )}
        <View bottom-view columns>
          <Button light split>
            <Text>{i18n.t('form:back')}</Text>
          </Button>
          <Button light split>
            <Text>{i18n.t('form:next')}</Text>
          </Button>
        </View>
      </Content>
    );
  }
}
