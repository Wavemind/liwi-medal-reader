// @flow

import * as React from 'react';
import { Button, Icon, Text, View } from 'native-base';
import { styles } from './About.style';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { ApplicationContext } from '../../../engine/contexts/Application.context';
import { LiwiTitle2, LiwiTitle4 } from '../../../template/layout';
import WebviewComponent from '../../../components/WebviewComponent';

const About = (props) => {
  const app = React.useContext(ApplicationContext);
  const {
    t,
    algorithm: {
      study: { description },
    },
  } = app;

  const { source } = props.navigation.state.params;

  const handlePress = () => {
    if (source === 'synchronize') {
      return NavigationService.navigate('UserSelection');
    }
    return NavigationService.navigate('Home');
  };

  return (
    <View style={styles.flexColumn}>
      <View style={styles.content}>
        <LiwiTitle2 noBorder style={styles.center}>
          ePOCT+: Tanzania
        </LiwiTitle2>
        <LiwiTitle4>Description</LiwiTitle4>
        <WebviewComponent htmlSource={description} customStyle={styles.webview} />
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

export default About;
