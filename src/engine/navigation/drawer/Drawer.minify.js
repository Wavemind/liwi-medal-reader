/*eslint-disable */
// TODO this file is in creating !
import React, { Component } from 'react';
import { View, Slider } from 'react-native';
import { Button } from 'native-base';
import { styles } from './Drawer.style';
import styled from 'styled-components';

const Wrapper = styled.View`
  padding: ${({ isOpen }) => (isOpen ? '13px 0' : '6px 0')};
  height: ${({ isOpen }) => (isOpen ? 'auto' : '200px')};
  width: ${({ isOpen }) => (isOpen ? 'auto' : '30px')};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: ${({ active }) => (active ? '#db473e' : '#e1e1e1')};
  flex: 1;
`;

const Text = styled.Text`
  color: ${({ active }) => (active ? '#ffffff' : '#3f3f3f')};
  text-align: center;
  text-transform: uppercase;
  font-size: ${({ isOpen }) => (isOpen ? '23px' : '21px')};
  line-height: ${({ isOpen }) => (isOpen ? '27px' : '25px')};
  font-family: Roboto-Medium;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(0deg)' : 'rotate(-90deg)')};
  width: ${({ isOpen }) => (isOpen ? 'auto' : '192px')};
  flex: 1;
`;

export class DrawerMinify extends Component<{ routeName: string, initialPage: string }> {
  state = {};

  render() {
    let {} = this.props;

    return (
      <>
        <View style={styles.drawerMinifySmallify}>
          <View style={styles.drawerMinifyView}>
            <View style={styles.drawerMinifyWrapButton}>
              <Text style={styles.drawerMinifyText} onPress={() => console.log('click minify')}>
                Triage
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  }
}
