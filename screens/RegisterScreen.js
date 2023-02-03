import {
  Text,
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Button, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';

const RegisterScreen = ({navigation}) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle create account button press
  async function createAccount() {
    try {
      await auth().createUserWithEmailAndPassword(email, password);

      const update = {
        displayName: name || 'anonymous',
        photoURL: image || 'https://my-cdn.com/assets/user/123.png',
      };

      await auth().currentUser.updateProfile(update);

      console.log('User account created & signed in!');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
      console.error(error);
    }
  }

  // Handle the verify phone button press
  async function verifyPhoneNumber(phoneNumber) {
    const confirmation = await auth().verifyPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }

  // Handle confirm code button press
  async function confirmCode() {
    try {
      const credential = auth.PhoneAuthProvider.credential(
        confirm.verificationId,
        code,
      );
      let userData = await auth().currentUser.linkWithCredential(credential);
      setUser(userData.user);
      console.log('success');
      navigation.navigate('Landing');
    } catch (error) {
      if (error.code == 'auth/invalid-verification-code') {
        console.log('Invalid code.');
      } else {
        console.log('Account linking error');
      }
    }
  }


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
          Sign Up
        </Text>
        <Text
          style={{
            marginLeft: 40,
            fontSize: 16,
            color: 'black',
            fontWeight: 400,
          }}>
          Create a New Account
        </Text>
        <View style={styles.inputContainer}>
          {!user ? (
            <>
              <TextInput
                value={email}
                onChangeText={text => setEmail(text)}
                placeholder="Email"
                autoFocus
                type="Email"
              />
              <TextInput
                value={password}
                onChangeText={text => setPassword(text)}
                placeholder="Password"
                secureTextEntry
                type="password"
              />
              <TextInput
                value={name}
                onChangeText={text => setName(text)}
                placeholder="name"
                type="text"
              />
              <TextInput
                placeholder="pictureUrl"
                secureTextEntry
                type="pictureUrl"
              />
            </>
          ) : (
            <>
              {user && !confirm ? (
                <TextInput
                placeholder='verifyPhone'
                  value={phone}
                  onChangeText={text => setPhone(text)}
                />
              ) : (
                <TextInput  placeholder='verifyCode'
                value={code} onChangeText={text => setCode(text)}
                onPress={() => confirmCode() }
                 />
              )}
            </>
          )}
        </View>
        {!user   ? (
          <Button
            titleStyle={{color: 'white', fontWeight: 'bold'}}
            containerStyle={styles.buttonLogin}
            type="outline"
            title="SignUp"
            onPress={() => createAccount()}
          />
        ) : (

          <>
          {user && !confirm ? (
            <Button
            titleStyle={{color: 'white', fontWeight: 'bold'}}
            containerStyle={styles.buttonLogin}
            type="outline"
            title="verifyPhoneNumber"
            onPress={() => verifyPhoneNumber(phone)}
          />
          ) : (

             <Button
             titleStyle={{color: 'white', fontWeight: 'bold'}}
             containerStyle={styles.buttonLogin}
             type="outline"
             title="VerifyCode"
             onPress={() => confirmCode()}
           />
          )}
        </>







        )}


      </View>
    </View>
  );
};

export default RegisterScreen;

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
    width: 250,
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
});
