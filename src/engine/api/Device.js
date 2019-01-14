import { Platform, Linking, Alert } from 'react-native';

import {
  Constants,
  Localization,
  Permissions,
  Location,
  IntentLauncherAndroid,
  NetInfo,
} from 'expo';

export default async () => {
  const geo = await Localization.getLocalizationAsync();
  let location = null;

  const getLocationAsync = async () => {
    const status = await Permissions.askAsync(Permissions.LOCATION);
    let getPosition;

    try {
      getPosition = await Location.getCurrentPositionAsync({
        enableHighAccuracy: false,
      });
    } catch (err) {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        IntentLauncherAndroid.startActivityAsync(
          IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
        );
      } else {
        Alert.alert(
          'Activer votre position',
          "Merci d'activer votre service de localisation dans vos réglages de confidentialités",
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                Linking.openURL('app-settings://');
              },
            },
          ],
          { cancelable: false }
        );
      }
    }

    return getPosition;
  };

  if (Platform.OS === 'android' && !Constants.isDevice) {
    console.log(
      'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
    );
  } else {
    location = getLocationAsync();
  }

  const coord = await location;

  let model =
    Platform.OS === 'ios' ? Constants.platform.ios.model : 'android device ?';

  return {
    activity: {
      latitude: coord.coords.latitude,
      longitude: coord.coords.longitude,
      timezone: geo.timezone,
      user_id: null,
      version: Constants.manifest.version,
      device_attributes: {
        reference_number: Constants.deviceId,
        model,
        brand: 0,
        name: Constants.deviceName,
        os: Platform.OS,
        os_version: Platform.Version,
      },
    },
  };
};

export const isConnected = () => {};
