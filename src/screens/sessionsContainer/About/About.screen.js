// @flow

import * as React from 'react';
import { Button, Icon, Text, View } from 'native-base';
import { ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { styles } from './About.style';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { ApplicationContext } from '../../../engine/contexts/Application.context';
import LiwiLoader from '../../../utils/LiwiLoader';
import { LiwiTitle2, LiwiTitle4 } from '../../../template/layout';

const About = (props) => {
  const app = React.useContext(ApplicationContext);
  const {
    t,
    algorithm: {
      algorithm_emergency_content,
      study: {
        description: { body },
      },
    },
  } = app;

  const { source } = props.navigation.state.params;

  const handlePress = () => {
    if (source === 'synchronize') {
      return NavigationService.navigate('UserSelection');
    }
    return NavigationService.navigate('Home');
  };

  /**
   * Display about app
   * @returns {*}
   * @private
   */
  const _renderAbout = () => {
    const htmlSource = {
      html: `
        <html lang="en">
            <head>
                <title>About page content</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>${algorithm_emergency_content}</body>
        </html>`,
    };

    return (
      <View style={styles.flexColumn}>
        <View style={styles.content}>
          <LiwiTitle2 noBorder style={styles.center}>
            ePOCT+: Tanzania
          </LiwiTitle2>
          <LiwiTitle4>Description</LiwiTitle4>
          <WebView source={htmlSource} style={styles.webview} startInLoadingState renderLoading={() => <LiwiLoader />} />
        </View>
        <View style={styles.footer}>
          <Button onPress={() => handlePress()} style={styles.button}>
            <Text size-auto>{source === 'synchronize' ? t('common:continue') : t('navigation:home')}</Text>
            <Icon name="arrowright" type="AntDesign" />
          </Button>
        </View>
      </View>
    );
  };

  return _renderAbout();
};

export default About;
