// @flow

import * as React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Button, Icon, Picker, Text, View } from 'native-base';

import { ApplicationContext } from '../../../engine/contexts/Application.context';
import CustomInput from '../../../components/InputContainer/CustomInput';
import { userRoles } from '../../../../frontend_service/constants';
import { getItem } from '../../../engine/api/LocalStorage';
import { styles } from './UserSelection.style';

export default function UserSelection() {
  const [selectedUser, setUser] = React.useState({
    id: null,
    last_name: '',
    first_name: '',
    role: '',
  });
  const [session, setSession] = React.useState(null);
  const [ready, setReady] = React.useState(false);

  const app = React.useContext(ApplicationContext);
  const { t } = app;

  React.useEffect(() => {
    (async function getSessionStorage() {
      setSession(await getItem('session'));
      setReady(true);
    })();
  }, []);

  if (ready === false) {
    return null;
  }

  /**
   * Render clinician button to select a clinician
   * @param user
   * @returns {*}
   */
  const renderClinician = (user) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.touchable}
        key={user.id}
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
          <View style={styles.blocName}>
            <Text style={styles.desc}>{user.first_name} </Text>
            <Text style={styles.desc}>{user.last_name}</Text>
          </View>
          <Text style={styles.title}>{userRoles[user.role]}</Text>

          {selectedUser?.id === user.id && <Icon type="AntDesign" name="checkcircleo" style={styles.icon} />}
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Render inputs for guest clinician
   */
  const inputs = (
    <>
      {selectedUser?.id === false && (
        <View style={styles.blocBackground}>
          <Text bigTitle>{t('unlock_session:fill')}</Text>
          <View style={styles.blocInput}>
            <View style={styles.items}>
              <CustomInput
                condensed
                init={selectedUser.last_name}
                label={t('patient:first_name')}
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
                label={t('patient:last_name')}
                change={(e, i) => setUser({ ...selectedUser, first_name: i })}
                index="surname"
                iconName="user"
                iconType="AntDesign"
                autoCapitalize="sentences"
              />
            </View>

            <View style={styles.items}>
              <View style={styles.textBloc}>
                <Icon name="medical-bag" type="MaterialCommunityIcons" style={styles.textIcon} />
                <Text style={styles.roleText}>{t('unlock_session:role')}</Text>
              </View>
              <Picker note mode="dropdown" style={styles.flex} selectedValue={selectedUser.role} onValueChange={(e) => setUser({ ...selectedUser, role: e })}>
                <Picker.Item label={t('application:select')} value={null} />
                {Object.keys(userRoles).map((e) => e !== 'guest' && <Picker.Item label={userRoles[e]} value={e} key={e} />)}
              </Picker>
            </View>
          </View>
        </View>
      )}
    </>
  );

  return (
    <ScrollView testID="UnLockSession">
      <View flex-container-column flex-center>
        <Text bigTitle>{t('unlock_session:who')}</Text>
        <View style={styles.blocParent}>
          {session.facility.medical_staffs.map((user) => renderClinician(user))}
          {renderClinician({ role: 'guest', last_name: '', first_name: '', id: false })}
        </View>
        {selectedUser !== null && selectedUser.last_name !== '' && selectedUser.first_name !== '' && selectedUser.role !== null && (
          <Button onPress={() => app.setUser(selectedUser)} style={styles.button}>
            <Text size-auto>Select {userRoles[selectedUser?.role]}</Text>
            <Icon name="arrowright" type="AntDesign" />
          </Button>
        )}
        {inputs}
      </View>
    </ScrollView>
  );
}
