import React, { useState, useEffect } from 'react';
import { Button, TextInput, Text, View, Image } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function PhoneVerification({navigation}) {
  // Set an initializing state whilst Firebase connects
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



  // Handle user state changes
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
      await auth().createUserWithEmailAndPassword(email, password)

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
      const credential = auth.PhoneAuthProvider.credential(confirm.verificationId, code);
      let userData = await auth().currentUser.linkWithCredential(credential);
      setUser(userData.user);
    } catch (error) {
       if (error.code == 'auth/invalid-verification-code') {
               console.log('Invalid code.');
             } else {
               console.log('Account linking error');

             }
      }

  }

  async function confirmLoginCode() {
    try {
      await confirm.confirm(code);
      console.log('youre logged in ')
    } catch (error) {
      console.log('Invalid code.');
    }
  }


  const login = async (phone) => {

    const confirmation = await auth().signInWithPhoneNumber(phone);
    setConfirm(confirmation);

  }

  const signOut = () => {
  auth()
    .signOut()
    .then(() => navigation.navigate('Home'));
    }

  if (initializing) return null;

  if (!user) {

    return (
    <>
      <TextInput  placeholder="Email" value={email} onChangeText={text => setEmail(text)} />
      <TextInput  placeholder="Name" value={name} onChangeText={text => setName(text)} />
      <TextInput secureTextEntry  placeholder="password" value={password} onChangeText={text => setPassword(text)} />
      <Button
          type="outline"
          containerStyle={{
            backgroundColor: "yellow",
            position: "absolute",
            right: 27,
            top: 4,
            borderRadius: 20,
            padding: 2,
          }}
          title="Select Image"
        />


     <Button title="Create an Account" onPress={() => createAccount()} />
     <TextInput value={phone} onChangeText={text => setPhone(text)} />
      <Button title="Login" onPress={() => login(phone) } />


      {confirm && (
        <>
        <TextInput value={code} onChangeText={text => setCode(text)} />
      <Button title="Confirm Code" onPress={() => confirmLoginCode()} />
      </>
      ) }





     </>
     )
  } else if (!user.phoneNumber) {
    if (!confirm) {
      return (
      <>
       <TextInput value={phone} onChangeText={text => setPhone(text)} />
        <Button
          title="Verify Phone Number"
          onPress={() => verifyPhoneNumber(phone)}
        />
        </>
      );
    }
    return (

      <>
        <TextInput value={code} onChangeText={text => setCode(text)} />
        <Button title="Confirm Code" onPress={() => confirmCode()} />

      </>
    );
  } else {

   return (
    <>
      <Text>
      <Button title="Login" onPress={() => signOut() } />
        Welcome! {user.phoneNumber} linked with {user.email}
      </Text>
      <View>
        <Image source={{
          uri: 'https://uploads.sitepoint.com/wp-content/uploads/2016/03/1458141432lock-1024x1024.jpg'
        }}

        style={{ width: 200, height: 200, borderRadius: 100, }}

        />
        <Text>{user.displayName}</Text>

      </View>
      {console.log(user)}

      </>
    );
  }
}