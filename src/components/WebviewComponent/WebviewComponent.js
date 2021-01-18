import React from 'react';
import { WebView } from 'react-native-webview';
import LiwiLoader from '../../utils/LiwiLoader';

const WebviewComponent = (props) => {
  const { htmlSource, customStyle } = props;

  const html = {
    html: `
        <html lang="en">
            <head>
                <title>About page content</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>${htmlSource}</body>
        </html>`,
  };

  return <WebView source={html} style={customStyle} startInLoadingState renderLoading={() => <LiwiLoader />} />;
};

export default WebviewComponent;
