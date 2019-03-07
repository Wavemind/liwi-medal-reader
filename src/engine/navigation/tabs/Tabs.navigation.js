import React, { Component } from 'react';
import { Col, Grid, Text, View } from 'native-base';
import {styles} from './Tabs.style';

export default class TabsNavigation extends Component {
  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.view } />
        <Grid style={ styles.grid }>
          <Col>
            <Text>Patient</Text>
          </Col>
          <Col>
            <Text>Questions</Text>
          </Col>
          <Col>
            <Text>Diagnostics</Text>
          </Col>
        </Grid>
      </View>
    );
  }
}
