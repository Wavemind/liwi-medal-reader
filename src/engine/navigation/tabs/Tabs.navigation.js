import React, { Component } from 'react';
import { View, Text, Grid, Col, Row } from 'native-base';

export default class TabsNavigation extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        {
          // trick for positionning...
        }
        <View style={{ flex: 0.8 }} />
        <Grid style={{ flex: 0.2 }}>
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
