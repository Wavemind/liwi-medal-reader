// @flow

import * as React from 'react';
import { Text, View } from 'native-base';
import * as NetInfo from '@react-native-community/netinfo';
import { AUDIOS_EXTENSION, MOVIES_EXTENSION, PICTURES_EXTENSION } from '../../utils/constants';
import i18n from '../../utils/i18n';
import { styles } from './Media.styles';
import Movie from './Movie';
import Audio from './Audio';
import Picture from './Picture';

export default class Media extends React.Component {
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
    const url = media.url.match(/^.*[?]/)[0];

    if (MOVIES_EXTENSION.includes(media.extension)) {
      return <Movie url={url} />;
    }
    if (AUDIOS_EXTENSION.includes(media.extension)) {
      return <Audio url={url} />;
    }
    if (PICTURES_EXTENSION.includes(media.extension)) {
      return <Picture url={url} />;
    }
    return <Text>{i18n.t('media:file_not_supported')}</Text>;
  }

  render() {
    const { isConnected, media } = this.state;
    return isConnected ? <View style={styles.container}>{this.mediaType(media)}</View> : null;
  }
}
