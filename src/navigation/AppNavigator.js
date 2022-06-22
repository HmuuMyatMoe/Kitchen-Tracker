import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged, signOut } from 'firebase/auth'; //use listener provided by firebase to observe state changes
import { MaterialIcons } from '@expo/vector-icons';

import { auth } from '../firebase';
import {
    MainScreen,
    LoginScreen,
    ForgotPasswordScreen,
    SignUpScreen,
    ListScreen,
    InventoryScreen,
    SettingsScreen,
} from '../screens';
//import { MyTabBar } from '../components';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    /**
     * This hook serves as a listener to auth state changes provided by firebase.
     */
    // Todo: isAuth hook
    const [isAuth, setisAuth] = useState(false); //declare a state to track whether the user is auth or not

    useEffect(() => {
        // Todo: Authentication
        //subsriber is a mounting func, takes in the auth instance and 
        //we declare another func on what to do when the User is logged in or out
        const subscriber = onAuthStateChanged(auth, (authUser) => {
            if (authUser) { //authUser will provide u w the user if they are authenticated
                setisAuth(true); //if user is present (auth), then set isAuth to true
            } else {
                setisAuth(false); //else false if no user at all
            }
        })

        return subscriber; //dont want to call this func over and over agn, if our screen unmounts, we return this func
    }, []); //dependency array - if its empty, we only run whats inside useEffect only once upon mounting our screen
    //can put vars in this array then useEffect will listen to changes in this var and trigger whats inside it if theres any changes

    const AuthNavigator = () => (
        <Stack.Navigator 
            initialRouteName="Main"
            >
            <Stack.Screen
                name="Main"
                options={{ title: 'Welcome' }}
                component={MainScreen}
            />
            <Stack.Screen
                name="Login"
                options={{ headerTitle: ' ' }}
                component={LoginScreen}
            />
            <Stack.Screen
                name="Forgot Password"
                options={{ headerTitle: ' ' }}
                component={ForgotPasswordScreen}
            />
            <Stack.Screen
                name="Sign Up"
                options={{ headerTitle: ' ' }}
                component={SignUpScreen}
            />
        </Stack.Navigator>
    );

    const logoutHandler = () => {
        // Todo: Authentication
        signOut(auth).then(() => {
            setisAuth(false);
        })
    };

    const LogoutIcon = () => (
        <TouchableOpacity onPress={logoutHandler}>
            <MaterialIcons name="logout" size={28} color="#407BFF" />
        </TouchableOpacity>
    );


    const TabNavigator = () => (
        <Tab.Navigator 
        initialRouteName='Food Inventory List'
        backBehavior='none'
        screenOptions={{
            headerPressColor: 'pink',
            tabBarHideOnKeyboard: true,
            tabBarInactiveBackgroundColor: 'black',
            tabBarActiveTintColor: 'green',
            tabBarInactiveTintColor: 'white',
           // lazy: true,
            tabBarStyle: {backgroundColor: 'black'},
        }}
        >
        <Tab.Screen
            name="Food Inventory List"
            options={{
                headerTitle: '',
                headerRight: () => <LogoutIcon />,
            }}
            component={InventoryScreen}
            
        >
        </Tab.Screen>
        <Tab.Screen
            name="To-buy List"
            options={{
                headerTitle: '',
                headerRight: () => <LogoutIcon />,
            }}
            component={ListScreen}
        />
        <Tab.Screen
            name="Settings"
            options={{
                headerTitle: '',
                headerRight: () => <LogoutIcon />,
            }}
            component={SettingsScreen}
        />
    </Tab.Navigator>
    );

    const FeatureNavigator = () => (
        <Stack.Navigator>
            <Stack.Screen
                name='Tabs'
                component={TabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Forgot Password"
                options={{
                    headerTitle: '',
                }}
                component={ForgotPasswordScreen}
            />
        </Stack.Navigator>
    );

    return (
        /* Todo: Authentication */
        //conditionally render a screen based on isAuth value
        <NavigationContainer>
            {isAuth ? <FeatureNavigator /> : <AuthNavigator />}
        </NavigationContainer> 
    );
};

export default AppNavigator;
