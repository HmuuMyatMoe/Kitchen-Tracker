import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged, signOut } from 'firebase/auth'; //use listener provided by firebase to observe state changes
import { MaterialIcons, MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons';

import { auth } from '../firebase';
import {
    MainScreen,
    LoginScreen,
    ForgotPasswordScreen,
    SignUpScreen,
    InventoryScreen,
    ToBuyScreen,
    SettingsScreen,
    ChangeEmailScreen,
} from '../screens';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    //This hook serves as a listener to auth state changes provided by firebase.
    // isAuth hook
    const [isAuth, setisAuth] = useState(false); //declare a state to track whether the user is auth or not

    useEffect(() => {
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
        signOut(auth).then(() => {
            setisAuth(false);
        })
    };

    const LogoutIcon = () => (
        <TouchableOpacity onPress={logoutHandler}>
            <MaterialIcons name="logout" size={25} color="#003c25" />
        </TouchableOpacity>
    );


    const TabNavigator = () => (
        <Tab.Navigator 
        initialRouteName='Food Inventory List'
        backBehavior='none'
        screenOptions={{
            headerPressColor: 'pink',
            tabBarHideOnKeyboard: true,
            tabBarActiveBackgroundColor: 'black',
            tabBarInactiveBackgroundColor: 'black',
            tabBarActiveTintColor: '#f89fa5',
            tabBarInactiveTintColor: 'white',
            tabBarStyle: {backgroundColor: 'black'},
        }}
        >
        <Tab.Screen
            name="Food Inventory List"
            options={{
                headerTitle: '',
                headerRight: () => <LogoutIcon />,
                tabBarIcon: ({focused}) => (
                   <View>
                      <MaterialCommunityIcons
                        name="food-apple-outline"
                        size={28}
                        color={focused ? "#f89fa5" : "white"}
                      />
                    </View>
                ),
            }}
            component={InventoryScreen}
            
        >
        </Tab.Screen>
        <Tab.Screen
            name="To-buy List"
            options={{
                headerTitle: '',
                headerRight: () => <LogoutIcon />,
                tabBarIcon: ({focused}) => (
                    <View>
                       <AntDesign
                         name="shoppingcart"
                         size={28}
                         color={focused ? "#f89fa5" : "white"}
                       />
                    </View>
                 ),
            }}
            component={ToBuyScreen}
        />
        <Tab.Screen
            name="Settings"
            options={{
                headerTitle: '',
                headerRight: () => <LogoutIcon />,
                tabBarIcon: ({focused}) => (
                    <View>
                       <Ionicons
                         name="settings-outline"
                         size={27}
                         color={focused ? "#f89fa5" : "white"}
                       />
                     </View>
                 ),
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
            <Stack.Screen
                name="Change Email"
                options={{
                    headerTitle: '',
                }}
                component={ChangeEmailScreen}
            />
        </Stack.Navigator>
    );

    return (
        //conditionally render a screen based on isAuth value
        <NavigationContainer>
            {isAuth ? <FeatureNavigator /> : <AuthNavigator />}
        </NavigationContainer> 
    );
};

export default AppNavigator;
