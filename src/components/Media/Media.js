// @flow

import * as React from 'react';
import { Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import * as NetInfo from '@react-native-community/netinfo';
import { AUDIOS_EXTENSION, MOVIES_EXTENSION, PICTURES_EXTENSION } from '../../utils/constants';
import i18n from '../../utils/i18n';
import { styles } from './Media.styles';
import Movie from './Movie';
import Audio from './Audio';
import Picture from './Picture';

type Props = NavigationScreenProps & {};

type State = {};

export default class Media extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: false,
      media: props.media,
    };
  }

  async componentDidMount() {
    const netInfoConnection = await NetInfo.fetch();
    const { isConnected } = netInfoConnection;
    this.setState({
      isConnected,
    });
  }

  /**
   * Display right component according to file extension
   * @param {Object} media
   * @returns {*}
   */
  mediaType(media) {
    if (MOVIES_EXTENSION.includes(media.extension)) {
      return <Movie url={media.url} />;
    }
    if (AUDIOS_EXTENSION.includes(media.extension)) {
      return <Audio url={media.url} />;
    }
    if (PICTURES_EXTENSION.includes(media.extension)) {
      return <Picture url={media.url} />;
    }
    return <Text>{i18n.t('media:file_not_supported')}</Text>;
  }

  render() {
    const { isConnected, media } = this.state;
    return isConnected ? <View style={styles.container}>{this.mediaType(media)}</View> : null;
  }
}
