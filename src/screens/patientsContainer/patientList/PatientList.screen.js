// @flow

import * as React from 'react';
import { Button, Icon, Input, Item, Text, View } from 'native-base';

import { styles } from './PatientList.style';
import { SeparatorLine } from '../../../template/layout';
import ConfirmationView from '../../../components/ConfirmationView';
import ListContent from '../../../components/ListContent';

export default class PatientList extends React.Component {
  state = {
    propsToolTipVisible: false,
    searchTerm: '',
    isGeneratingPatient: false,
  };

  /**
   * Hide popup
   */
  callBackClose = () => {
    this.setState({
      propsToolTipVisible: false,
    });
  };

  render() {
    const { searchTerm, isGeneratingPatient, propsToolTipVisible } = this.state;

    const {
      app: { t },
      navigation,
      medicalCase,
    } = this.props;

    return (
      <>
        <View padding-auto style={styles.topSpace}>
          <View style={styles.flexDirectionRow}>
            <Item style={styles.inputGroup}>
              <Icon active name="search" />
              <Input value={searchTerm} onChangeText={this.searchBy} />
            </Item>
            <ConfirmationView callBackClose={this.callBackClose} propsToolTipVisible={propsToolTipVisible} nextRoute="PatientUpsert" idPatient={null}
            />
          </View>

          <Button
            testID="create_patient"
            full
            red
            onPress={() => {
              if (medicalCase.id === undefined || medicalCase.isNewCase === 'false') {
                navigation.navigate('PatientUpsert', {
                  idPatient: null,
                  newMedicalCase: true,
                });
              } else {
                this.setState({ propsToolTipVisible: true });
              }
            }}
            disabled={isGeneratingPatient}
          >
            <Text center size-auto>
              {t('patient_list:add')}
            </Text>
          </Button>

          <SeparatorLine />
        </View>

        <ListContent model="Patient" list="patient_list" itemNavigation="PatientProfile" />
      </>
    );
  }
}
