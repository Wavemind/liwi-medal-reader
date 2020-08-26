// @flow

import * as React from 'react';
import { Button, Icon, Input, Item, Text, View } from 'native-base';
import _ from 'lodash';

import { styles } from './PatientList.style';
import { SeparatorLine } from '../../../template/layout';
import ListContent from '../../../components/ListContent';

export default class PatientList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      query: '',
      isGeneratingPatient: false,
      searchByDelayed: _.debounce(() => {
        const { searchTerm } = this.state;
        this.setState({ query: searchTerm });
      }, 350),
    };
  }

  /**
   * Search by term in database
   * @param {string} searchTerm - Term typed for search
   */
  searchBy = (searchTerm) => {
    const { searchByDelayed } = this.state;
    this.setState({ searchTerm });
    searchByDelayed(searchTerm);
  };

  /**
   * Action call when element of flatlist is clicked
   * @param {object} patient - Patient clicked
   * @returns {Promise<void>}
   */
  itemNavigation = async (patient) => {
    const { navigation } = this.props;
    navigation.navigate('PatientProfile', {
      id: patient.id,
    });
  };

  render() {
    const { searchTerm, query, isGeneratingPatient } = this.state;

    const {
      app: { t },
      navigation,
    } = this.props;

    return (
      <>
        <View padding-auto margin-top>
          <View style={styles.flexDirectionRow}>
            <Item style={styles.inputGroup}>
              <Icon active name="search" type="FontAwesome5" />
              <Input value={searchTerm} onChangeText={this.searchBy} />
            </Item>
          </View>

          <Button
            testID="create_patient"
            full
            red
            onPress={() => {
              navigation.navigate('PatientUpsert', {
                idPatient: null,
                newMedicalCase: true,
              });
            }}
            disabled={isGeneratingPatient}
          >
            <Text center size-auto>
              {t('patient_list:add')}
            </Text>
          </Button>

          <SeparatorLine />
        </View>

        <ListContent query={query} model="Patient" list="patient_list" itemNavigation={this.itemNavigation} />
      </>
    );
  }
}
