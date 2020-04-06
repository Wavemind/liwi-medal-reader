// @flow

import * as React from 'react';
import { Image, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Col, Icon, Text, View } from 'native-base';
import { ApplicationContext } from '../../../engine/contexts/Application.context';
import { liwiColors, screenWidth } from '../../../utils/constants';
import { styles } from './UserSelection.style';
import CustomInput from '../../../components/InputContainer/CustomInput';

export default function UserSelection() {
  // Hooks
  const [selectedUser, setUser] = React.useState({
    id: null,
    lastname: '',
    firstname: '',
    role: '',
  });

  const app = React.useContext(ApplicationContext);

  const { session } = app;

  const switchIcon = (role) => {
    switch (role) {
      case 'Clinician':
        return <Image style={styles.img} resizeMode="contain" source={require('../../../../assets/images/doc.png')} />;
      case 'Lab':
        return <Image style={styles.img} resizeMode="contain" source={require('../../../../assets/images/scientist.png')} />;
      case 'Nurse':
        return <Image style={styles.img} resizeMode="contain" source={require('../../../../assets/images/nurse.png')} />;
      default:
        return <Image style={styles.img} resizeMode="contain" source={require('../../../../assets/images/guest.png')} />;
    }
  };

  const renderBloc = (user) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.touchable}
        onPress={() => {
          setUser(user);
        }}
      >
        <View
          style={{
            ...styles.bloc,
            elevation: selectedUser?.id === user.id ? 5 : 0.5,
          }}
        >
          <Text style={styles.desc}>{user.role}</Text>
          {switchIcon(user.role)}
          <View style={styles.blocName}>
            <Text style={{ ...styles.title, color: liwiColors.blackLightColor }}>{user.preFix} </Text>
            <Text style={styles.title}>{user?.surname} </Text>
            <Text style={styles.title}>{user?.name} </Text>
          </View>

          {selectedUser?.id === user.id && <Icon type="AntDesign" name="checkcircleo" style={styles.icon} />}
        </View>
      </TouchableOpacity>
    );
  };

  const inputs = (
    <>
      {selectedUser?.id === false && (
        <View style={styles.blocBackground}>
          <Text bigTitle>Fill the missing informations as Guest</Text>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={styles.items}>
              <CustomInput
                condensed
                init={selectedUser.lastname}
                label={app.t('patient:first_name')}
                change={(e, i) => setUser({ ...selectedUser, lastname: i })}
                index="lastname"
                iconName="user"
                iconType="AntDesign"
                autoCapitalize="sentences"
              />
            </View>
            <View style={styles.items}>
              <CustomInput
                condensed
                init={selectedUser.surname}
                label={app.t('patient:last_name')}
                change={(e, i) => setUser({ ...selectedUser, surname: i })}
                index="surname"
                iconName="user"
                iconType="AntDesign"
                autoCapitalize="sentences"
              />
            </View>

            <View style={styles.items}>
              <CustomInput
                condensed
                init={selectedUser.role}
                label="Role *"
                change={(e, i) => setUser({ ...selectedUser, role: i })}
                index="role"
                iconName="medical-bag"
                iconType="MaterialCommunityIcons"
                autoCapitalize="sentences"
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
  const selectButton = (
    <>
      {selectedUser !== null && selectedUser.lastname !== '' && selectedUser.surname !== '' && selectedUser.role !== '' && (
        <Button onPress={() => app.setUser(selectedUser)} style={styles.button}>
          <Text size-auto>Select {selectedUser?.role}</Text>
          <Icon name="arrowright" type="AntDesign" />
        </Button>
      )}
    </>
  );

  return (
    <ScrollView testID="UnLockSession">
      <View flex-container-column flex-center>
        <Text bigTitle>Who are you ?</Text>
        <View style={styles.blocParent}>
          {session.group.users.map((user) => renderBloc(user))}
          {renderBloc({ role: 'Guest', lastname: '', surname: '', id: false })}
        </View>
        {selectButton}
        {inputs}
      </View>
    </ScrollView>
  );
}
