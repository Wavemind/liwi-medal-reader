import React, { Component } from 'react';
import { Text } from "native-base";
import { Collapse, CollapseBody, CollapseHeader } from 'accordion-collapse-react-native';
import { styles } from './Filter.style';

export default class Filter extends Component {

  render() {
    return (
      <Collapse>
        <CollapseHeader style={styles.filterButton}>
          <Text white>Add filter</Text>
        </CollapseHeader>
        <CollapseBody>
          <Text>Ta daa!</Text>
        </CollapseBody>
      </Collapse>
    );
  }
}
