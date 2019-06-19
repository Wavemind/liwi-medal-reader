import React, { Component } from 'react';
import { Text, View } from 'native-base';
import { styles } from './ConsultationTabs.style';
import { TouchableOpacity } from 'react-native';

export default class ConsultationTabs extends Component {
  _renderRound = (n, active) => {
    return (
      <View style={ [styles.round, active ? styles.active : styles.unactive] }>
        <View flex-center>
          <Text dark>{ n }</Text>
        </View>
      </View>
    );
  };

  onPress = (path) => {
    this.props.navigation.navigate( path );
  };

  render() {
    const {
      t,
      navigation: {
        state: { index },
      },
    } = this.props;

    return (
      <View style={ styles.container }>
        <View flex-container-row>
          <TouchableOpacity
            onPress={ () => this.onPress( 'MedicalHistory' ) }
            style={ styles.touchable }
          >
            { this._renderRound( 1, index === 0 ) }
            <Text center>{ t( 'consultation:medical_history' ) }</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={ () => this.onPress( 'PhysicalExams' ) }
            style={ styles.touchable }
          >
            { this._renderRound( 2, index === 1 ) }
            <Text center>{ t( 'consultation:physical_exam' ) }</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={ () => this.onPress( 'Poct' ) }
            style={ styles.touchable }
          >
            { this._renderRound( 3, index === 2 ) }
            <Text center>{ t( 'consultation:poct' ) }</Text>
          </TouchableOpacity>


        </View>
      </View>
    );
  }
}
