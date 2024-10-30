import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import HomeScreen from './layouts/HomeScreen';
import LoginScreen from './layouts/LoginScreen';
import SignupScreen from './layouts/SignupScreen';
import MessageScreen from './layouts/MessageScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './layouts/ProfileScreen';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState , useLayoutEffect } from 'react';
import Toast from 'react-native-toast-message';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerNavigation (){
    return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>)
}


export default function App() {
  // const navigation = useNavigation() 
  const [token ,setToken] = useState(null)

  async function getToken(){
    const getData = await AsyncStorage.getItem("token")
    setToken(getData)
  }
  


  useLayoutEffect(() => {
    getToken()
  },[token])
  
  console.log(token);
  

  return (
    <Provider store={store} >
      <NavigationContainer>
          <Stack.Navigator>
            {<Stack.Screen name="Login" component={LoginScreen} />}
            {<Stack.Screen name="Signup" component={SignupScreen} />}
            {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
            {<Stack.Screen name="Drawer" options={{headerShown:false}} component={DrawerNavigation} />} 
            <Stack.Screen name="Message" component={MessageScreen} />
          </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </Provider>
  );
}