// @flow
import React, { Component } from 'react';
import { Content, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './HealthCares.style';

type Props = NavigationScreenProps & {};
type State = {};
// eslint-disable-next-line react/prefer-stateless-function
export default class HealthCares extends Component<Props, State> {
  render() {
    const {
      medicalCase,
      app: { t },
    } = this.props;
    
    const healthCares = medicalCase.nodes.getHealthCares();
    
    const { managements, treatments } = healthCares;
    
    return (
      <Content>
      <Text customTitle>{t('medical_case:managements')}</Text>
      {Object.keys(managements).map((key) => (
        <View style={styles.blocManagement}>
        <Text style={styles.spaceText} size-auto key={`healthcare${managements[key].reference}`}>
        {__DEV__ ? `${managements[key].reference} - ` : null}
        {managements[key].label}
        </Text>
        {managements[key].description !== null ?
          <Text style={styles.desc}>{managements[key].description}</Text> 
          : null}
          </View>
          ))}
          <Text customTitle>{t('medical_case:treatments')}</Text>
          {Object.keys(treatments).map((key) => (
            <View style={styles.blocManagement} key={`treatments${treatments[key].reference}`}>
            <Text style={styles.spaceText} size-auto >
            {__DEV__ ? `${treatments[key].reference} - ` : null}
            {treatments[key].label}
            </Text>
            {treatments[key].description !== null ?
              <Text style={styles.desc}>{treatments[key].description}</Text> 
              : null}
              </View>
              ))}
              </Content>
              );
            }
          }
          