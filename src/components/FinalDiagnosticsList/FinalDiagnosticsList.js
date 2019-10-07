// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Icon, Text } from 'native-base';
import { nodesType } from '../../../frontend_service/constants';
import { liwiColors } from '../../utils/constants';
import { styles } from './FinalDiagnosticsList.style';

type Props = NavigationScreenProps & {};

type State = {};

export default class FinalDiagnosticsList extends React.PureComponent<
  Props,
  State
> {
  state = {};

  async componentWillMount() {}

  render() {
    const {
      medicalCase: { nodes },
    } = this.props;

    let finalDiagnostics = nodes.filterByType(nodesType.finalDiagnostic);

    const items = [];

    for (let index in finalDiagnostics) {
      if (finalDiagnostics.hasOwnProperty(index)) {
        let finalDiagnostic = finalDiagnostics[index];
        let condition = finalDiagnostic.calculateCondition();

        let type;
        let style = {};
        let name;

        switch (condition) {
          case true:
            type = 'AntDesign';
            name = 'checkcircle';
            style.color = liwiColors.greenColor;
            break;
          case false:
            type = 'Entypo';
            name = 'circle-with-cross';
            style.color = liwiColors.redColor;
            break;
          case null:
            type = 'AntDesign';
            name = 'minuscircleo';
            style.color = liwiColors.darkerGreyColor;
            break;
        }

        items.push(
          <Text style={styles.spaceText} size-auto>
            <Icon type={type} name={name} style={style} /> - 
            {finalDiagnostic.id} - {finalDiagnostic.label}
          </Text>
        );
      }
    }

    return <React.Fragment>{items}</React.Fragment>;
  }
}
