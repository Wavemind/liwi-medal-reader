// @flow

import * as React from 'react';
import { Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import * as NetInfo from '@react-native-community/netinfo';
import Movie from './Movie';
import Audio from './Audio';
import Picture from './Picture';
import { AUDIOS_EXTENSION, MOVIES_EXTENSION, PICTURES_EXTENSION } from '../../utils/constants';
import i18n from '../../utils/i18n';

type Props = NavigationScreenProps & {};

type State = {};

export default class Media extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: false,
      url: props.url,
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
   * @param {String} url - File url
   * @returns {*}
   */
  mediaType(url) {
    const extension = url.split('.').pop();

    if (MOVIES_EXTENSION.includes(extension)) {
      return <Movie url={url} />;
    }
    if (AUDIOS_EXTENSION.includes(extension)) {
      return <Audio url={url} />;
    }
    if (PICTURES_EXTENSION.includes(extension)) {
      return <Picture url={url} />;
    }
    return <Text>{i18n.t('media:file_not_supported')}</Text>;
  }

  render() {
    const { isConnected, url } = this.state;
    return isConnected ? this.mediaType(url) : null;
  }
}
