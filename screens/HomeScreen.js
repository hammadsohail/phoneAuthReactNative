import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Button, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import {CountryPicker} from 'react-native-country-codes-picker';

const HomeScreen = ({navigation}) => {
  const [initializing, setInitializing] = useState(true);
  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const [user, setUser] = useState();
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+92');

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const login = async phone => {
    const confirmation = await auth().signInWithPhoneNumber(phone);
    setConfirm(confirmation);
  };

  const confirmLoginCode = async () => {
    try {
      await confirm.confirm(code);
      setConfirm(0);
      console.log('youre logged in ');
      navigation.navigate('Landing', {
        userEmail: user.email,
      });

    } catch (error) {
      console.log('Invalid code.');
    }
  };

  console.log(user);

  const [verify, setVerify] = useState();

  const verifyPhone = countryCode + phone;



console.log(confirm);

  return (
    <View style={styles.container}>
      {/* image */}
      <View style={{backgroundColor: 'blue', opacity: 0.5}}>
        <Image
          source={{
            uri: 'https://w0.peakpx.com/wallpaper/161/101/HD-wallpaper-purple-city.jpg',
          }}
          style={{width: 450, height: 300}}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          top: 30,
          left: 100,
          alignItems: 'center',
        }}>
        <View />
        <Icon name="map-marker" type="FontAwesome" size={100} color="white" />
        <Text
          style={{
            fontSize: 40,
            color: 'white',

            fontWeight: 700,
          }}>
          VISION GO
        </Text>
      </View>

      <View style={styles.contain}>
        <Text
          style={{
            marginLeft: 40,
            fontSize: 30,
            color: 'purple',
            fontWeight: 400,
          }}>
          Login
        </Text>
        <Text
          style={{
            marginLeft: 40,
            fontSize: 16,
            color: 'black',
            fontWeight: 400,
          }}>
          Continue as exsisting users
        </Text>
        <View style={styles.inputContainer}>
          {confirm < 1 ? (
            <SafeAreaView style={{flexDirection: 'row', marginTop: 20}}>
              <TouchableOpacity
                onPress={() => setShow(true)}
                style={{
                  width: '20%',
                  height: 45,
                  padding: 10,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                  }}>
                  {countryCode}
                </Text>
              </TouchableOpacity>

              <CountryPicker
                show={show}
                // when picker button press you will get the country object with dial code
                pickerButtonOnPress={item => {
                  setCountryCode(item.dial_code);
                  setShow(false);
                }}
              />

              <TextInput
                value={phone}
                onChangeText={text => setPhone(text)}
                placeholder="phone"
                autoFocus
                type="phonenumber"
              />
            </SafeAreaView>
          ) : (
            <TextInput
              value={code}
              onChangeText={text => setCode(text)}
              placeholder="code"
              secureTextEntry
              type="password"
            />
          )}
        </View>

        {confirm < 1 ? (
          <>
            <Button
              titleStyle={{color: 'white', fontWeight: 'bold'}}
              containerStyle={styles.buttonLogin}
              type="outline"
              title="VerifyPhoneNumber"
              onPress={() => login(verifyPhone)}
            />
            <Text
              style={{
                paddingTop: 7,
                alignSelf: 'center',
                fontSize: 16,
                fontWeight: 700,
                color: 'purple',
              }}>
              New to JCP?
            </Text>
            <Button
              titleStyle={{color: 'white', fontWeight: 'bold'}}
              containerStyle={styles.buttonRegister}
              type="outline"
              title="Register"
              onPress={() => navigation.navigate('Register')}
            />
          </>
        ) : (
          <Button
            titleStyle={{color: 'white', fontWeight: 'bold'}}
            containerStyle={styles.buttonLogin}
            type="outline"
            title="ConfirmCode"
            onPress={() => confirmLoginCode()}
          />
        )}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contain: {
    flex: 1,
    backgroundColor: 'white',
    positon: 'absolute',
    bottom: 100,
    borderRadius: 20,
    padding: 30,
  },

  inputContainer: {
    width: 300,
    marginTop: 30,
    alignSelf: 'center',
  },

  button: {
    width: 200,
    marginTop: 10,
  },
  buttonLogin: {
    width: 200,
    marginTop: 10,
    backgroundColor: 'purple',
    color: 'white',
    borderRadius: 30,
    alignSelf: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },

  buttonRegister: {
    width: 200,
    marginTop: 10,
    backgroundColor: 'black',
    color: 'white',
    borderRadius: 30,
    alignSelf: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  countryCodePicker: {
    alignSelf: 'center',
  },
  togglerContainerStyle: {
    backgroundColor: '#baffc0',
    borderRadius: 10,
    padding: 5,
  },
  togglerLabelStyle: {
    fontSize: 20,
  },
  searchInputStyle: {
    borderColor: '#888888',
    borderWidth: 1,
    height: 36,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  pickerItemLabelStyle: {
    marginLeft: 10,
    marginVertical: 10,
    alignSelf: 'center',
  },
  pickerItemContainerStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
});
