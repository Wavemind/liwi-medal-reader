import React, { Component } from 'react';
import { Button, Icon, Text } from 'native-base';
import { styles } from './Drawer.style';
import { TouchableOpacity, View } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export class CategorieButton extends Component<{ t: any, r: any, navigation: any }> {
  render() {
    let { t, r, navigation, name, initialPage, navigate } = this.props;
    return (
      <Button onPress={() => navigate(name, initialPage)} drawerCategorieButton style={[r.routeName === name ? styles.activeButtonCategorie : null]}>
        <Text drawerCategorieText style={[r.routeName === name ? null : styles.activeTextcategorie]}>
          {t}
        </Text>
      </Button>
    );
  }
}

export class ItemButton extends Component<{ t: any, r: any, navigation: any }> {
  shouldComponentUpdate(nextProps) {
    return true;

    console.log(nextProps.r.params?.initialPage, this.props.r.params?.initialPage, nextProps.r.params?.routeName === this.props.name);
    return nextProps.r.params?.initialPage !== this.props.r.params?.initialPage && nextProps.r.params?.routeName === this.props.name;
  }

  render() {
    let { t, r, navigation, initialPage, name, navigate } = this.props;
    return (
      <Button onPress={() => navigate(name, initialPage)} drawerItemButton transparent>
        <Icon
          drawerItemIcon
          style={r?.params?.initialPage >= initialPage && r.routeName === name ? styles.activeLink : null}
          type="Ionicons"
          name={r?.params?.initialPage >= initialPage && r.routeName === name ? 'md-radio-button-on' : 'md-radio-button-off'}
        />
        <Text drawerItemText style={r?.params?.initialPage >= initialPage && r.routeName === name ? styles.activeLink : null}>
          {t}
        </Text>
      </Button>
    );
  }
}

export class PathBar extends Component<{ active: any, routeName: string, navigation: Object, initialPage: string }> {
  render() {
    let { r, routeName, navigation, initialPage, navigate } = this.props;
    let active = r?.params?.initialPage >= initialPage && r.routeName === routeName;
    return (
      <TouchableOpacity onPress={() => navigate(routeName, initialPage)} style={{ marginTop: -2, marginBottom: -3, flex: 1, flexDirection: 'row' }}>
        <View
          style={{
            flex: 1,
            borderLeftWidth: 3,
            borderLeftColor: active ? liwiColors.redColor : liwiColors.greyColor,
            marginLeft: 14,
          }}
        />
      </TouchableOpacity>
    );
  }
}
