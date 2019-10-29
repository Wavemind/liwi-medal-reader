// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Icon, Text } from 'native-base';
import { nodesType } from '../../../frontend_service/constants';
import { liwiColors } from '../../utils/constants';
import { styles } from './FinalDiagnosticsList.style';
import { LiwiTitle3 } from '../../template/layout';

type Props = NavigationScreenProps & {};

type State = {};

class FinalDiagnostic extends React.Component<{}> {
  shouldComponentUpdate(nextProps: Props): boolean {
    // eslint-disable-next-line react/prop-types
    const { name } = this.props;
    // eslint-disable-next-line react/prop-types
    return name !== nextProps.name;
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { type, name, style, label, id } = this.props;
    return (
      <Text style={styles.spaceText} size-auto>
        <Icon type={type} name={name} style={style} /> {id} - {label}
      </Text>
    );
  }
}

export default class FinalDiagnosticsList extends React.PureComponent<
  Props,
  State
> {
  state = {};

  render() {
    const {
      medicalCase: { nodes },
    } = this.props;
    let finalDiagnosticsRedux = nodes.filterByType(nodesType.finalDiagnostic);

    const finalDiagnosticsNull = [];
    const finalDiagnosticsTrue = [];
    const finalDiagnosticsFalse = [];

    for (let index in finalDiagnosticsRedux) {
      if (finalDiagnosticsRedux.hasOwnProperty(index)) {
        let finalDiagnostic = finalDiagnosticsRedux[index];
        let condition = finalDiagnostic.calculateCondition();

        let type;
        let style = {};
        let name;

        switch (condition) {
          case true:
            type = 'AntDesign';
            name = 'checkcircle';
            style.color = liwiColors.greenColor;
            finalDiagnosticsTrue.push({
              ...finalDiagnostic,
              type,
              name,
              style,
            });

            break;
          case false:
            type = 'Entypo';
            name = 'circle-with-cross';
            style.color = liwiColors.redColor;
            finalDiagnosticsFalse.push({
              ...finalDiagnostic,
              type,
              name,
              style,
            });
            break;
          case null:
            type = 'AntDesign';
            name = 'minuscircleo';
            style.color = liwiColors.darkerGreyColor;
            finalDiagnosticsNull.push({
              ...finalDiagnostic,
              type,
              name,
              style,
            });
            break;
        }
      }
    }

    return (
      <React.Fragment>
        <LiwiTitle3>True</LiwiTitle3>
        {finalDiagnosticsTrue.map((f) => (
          <FinalDiagnostic {...f} key={f.id} />
        ))}

        <LiwiTitle3>False</LiwiTitle3>
        {finalDiagnosticsFalse.map((f) => (
          <FinalDiagnostic {...f} key={f.id} />
        ))}

        <LiwiTitle3>Null</LiwiTitle3>
        {finalDiagnosticsNull.map((f) => (
          <FinalDiagnostic {...f} key={f.id} />
        ))}
      </React.Fragment>
    );
  }
}
