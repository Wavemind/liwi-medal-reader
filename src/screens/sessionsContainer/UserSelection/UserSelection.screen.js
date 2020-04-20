// @flow

import * as React from 'react';
import { Image, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Icon, Picker, Text, View } from 'native-base';
import { ApplicationContext } from '../../../engine/contexts/Application.context';
import { liwiColors } from '../../../utils/constants';
import { styles } from './UserSelection.style';
import CustomInput from '../../../components/InputContainer/CustomInput';
import { userRole } from '../../../../frontend_service/constants';

export default function UserSelection() {
  // Hooks
  const [selectedUser, setUser] = React.useState({
    id: null,
    last_name: '',
    first_name: '',
    role: '',
  });

  const app = React.useContext(ApplicationContext);

  const { session } = app;

  // Render Image depending role
  const switchIcon = (role) => {
    switch (role) {
      case 'clinician':
        return <Image style={styles.img} resizeMode="contain" source={require('../../../../assets/images/doc.png')} />;
      case 'lab':
        return <Image style={styles.img} resizeMode="contain" source={require('../../../../assets/images/scientist.png')} />;
      case 'triage_nurse':
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
          <Text style={styles.desc}>{userRole[user.role]}</Text>
          {switchIcon(user.role)}
          <View style={styles.blocName}>
            <Text style={styles.title}>{user?.first_name} </Text>
            <Text style={styles.title}>{user?.last_name}</Text>
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
          <Text bigTitle>{app.t('unlock_session:fill')}</Text>
          <View style={styles.blocInput}>
            <View style={styles.items}>
              <CustomInput
                condensed
                init={selectedUser.last_name}
                label={app.t('patient:first_name')}
                change={(e, i) => setUser({ ...selectedUser, last_name: i })}
                index="lastname"
                iconName="user"
                iconType="AntDesign"
                autoCapitalize="sentences"
              />
            </View>
            <View style={styles.items}>
              <CustomInput
                condensed
                init={selectedUser.first_name}
                label={app.t('patient:last_name')}
                change={(e, i) => setUser({ ...selectedUser, first_name: i })}
                index="surname"
                iconName="user"
                iconType="AntDesign"
                autoCapitalize="sentences"
              />
            </View>

            <View style={styles.items}>
              <View style={styles.textBloc}>
                <Icon name={'medical-bag'} type={'MaterialCommunityIcons'} style={styles.textIcon} />
                <Text style={styles.roleText}>Role</Text>
              </View>
              <Picker note mode="dropdown" style={styles.flex} selectedValue={selectedUser.role} onValueChange={(e) => setUser({ ...selectedUser, role: e })}>
                <Picker.Item label="Select the role" value={null} />
                {Object.keys(userRole).map((e) => e !== 'guest' && <Picker.Item label={userRole[e]} value={e} key={e} />)}
              </Picker>
            </View>
          </View>
        </View>
      )}
    </>
  );

  const selectButton = (
    <>
      {selectedUser !== null && selectedUser.last_name !== '' && selectedUser.first_name !== '' && selectedUser.role !== null && (
        <Button onPress={() => app.setUser(selectedUser)} style={styles.button}>
          <Text size-auto>Select {userRole[selectedUser?.role]}</Text>
          <Icon name="arrowright" type="AntDesign" />
        </Button>
      )}
    </>
  );

  return (
    <ScrollView testID="UnLockSession">
      <View flex-container-column flex-center>
        <Text bigTitle>{app.t('unlock_session:who')}</Text>
        <View style={styles.blocParent}>
          {session.group.medical_staffs.map((user) => renderBloc(user))}
          {renderBloc({ role: 'guest', last_name: '', first_name: '', id: false })}
        </View>
        {selectButton}
        {inputs}
      </View>
    </ScrollView>
  );
}
