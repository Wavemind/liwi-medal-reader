// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Icon, Text } from 'native-base';
import { styles } from './FinalDiagnosticsList.style';
import { LiwiTitle3 } from '../../template/layout';
import { FinalDiagnosticModel } from '../../../frontend_service/engine/models/FinalDiagnostic.model';

type Props = NavigationScreenProps & {};

type State = {};

class FinalDiagnostic extends React.Component<{}> {
  shouldComponentUpdate(nextProps: Props): boolean {
    const { name } = this.props;
    return name !== nextProps.name;
  }

  render() {
    const { type, name, style, label, id } = this.props;
    return (
      <Text style={styles.spaceText} size-auto>
        <Icon type={type} name={name} style={style} /> {id} - {label}
      </Text>
    );
  }
}

export default class FinalDiagnosticsList extends React.PureComponent<Props, State> {
  state = {};

  render() {

    const finalDiagnostics = FinalDiagnosticModel.all();

    return (
      <React.Fragment>
        <LiwiTitle3>True</LiwiTitle3>
        {finalDiagnostics.included.map((f) => (
          <FinalDiagnostic {...f} key={f.id} />
        ))}

        <LiwiTitle3>False</LiwiTitle3>
        {finalDiagnostics.excluded.map((f) => (
          <FinalDiagnostic {...f} key={f.id} />
        ))}

        <LiwiTitle3>Null</LiwiTitle3>
        {finalDiagnostics.not_defined.map((f) => (
          <FinalDiagnostic {...f} key={f.id} />
        ))}
      </React.Fragment>
    );
  }
}
