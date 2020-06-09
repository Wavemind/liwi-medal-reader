import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const {
      navigation,
      app: { session, user},
    } = this.props;
    let routeName = 'NewSession';

    if (session !== undefined) {
      routeName = user !== null ? 'UnlockSession' : 'UserSelection';
    }

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    navigation.navigate(routeName);
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
