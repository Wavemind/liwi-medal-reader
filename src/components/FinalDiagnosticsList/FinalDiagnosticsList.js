// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Icon, Text } from 'native-base';
import { styles } from './FinalDiagnosticsList.style';
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
        <Icon type={type} name={name} style={style} /> {__DEV__ ? `${id} - ` : null}
        {label}
      </Text>
    );
  }
}

export default class FinalDiagnosticsList extends React.Component<Props, State> {
  state = {};

  // When we clear the store redux
  shouldComponentUpdate(nextProps: Props): boolean {
    if (nextProps.medicalCase.id === undefined) {
      return false;
    }
    return true;
  }

  render() {
    const finalDiagnostics = FinalDiagnosticModel.all();

    return (
      <React.Fragment>
        <Text customTitle>Retained</Text>
        {finalDiagnostics.included.map((f) => (
          <FinalDiagnostic {...f} type="AntDesign" name="checkcircle" key={f.id} style={styles.greenIcon} />
        ))}

        {/* TODO: 27.12.2019 Temporarly remove those diag for a demo */}
        {false ? (
          <>
            <Text customTitle>Excluded</Text>
            {
              finalDiagnostics.excluded.map((f) => (
                <FinalDiagnostic {...f} name="circle-with-cross" type="Entypo" key={f.id} style={styles.redIcon} />
              ))
            }

            <Text customTitle>Possible</Text>
            {finalDiagnostics.not_defined.map((f) => (
              <FinalDiagnostic {...f} key={f.id} type="AntDesign" name="minuscircleo" style={styles.grayIcon} />
            ))}
          </>
        ) : null}
      </React.Fragment>
    );
  }
}
