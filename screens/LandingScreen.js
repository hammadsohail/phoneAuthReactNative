
import { View, Text, StyleSheet } from 'react-native'
import React, {useState, useEffect} from 'react'
import auth from '@react-native-firebase/auth';
import {Button, Input} from 'react-native-elements';

const LandingScreen = ({route, navigation}) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  // const { userEmail } = route.params;


  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);


console.log(user)


  const signOut = () => {
    auth()
      .signOut()
      .then(() => navigation.navigate('Home'));
      }

  return (
    <View>
      <Text>Welcome : {user?.email}</Text>
      <Text>Phone : {user?.phoneNumber}</Text>

      <Button
          titleStyle={{color: 'white', fontWeight: 'bold'}}
          containerStyle={styles.buttonLogin}
          type="outline"
          title="Logout"
          onPress={() => signOut() }
        />
    </View>
  )
}

export default LandingScreen;

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

    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
  },
});
