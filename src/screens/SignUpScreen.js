import {
    StyleSheet,
    View,
    Text,
    ToastAndroid,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';

import { AuthTextInput, AuthPressable, SwitchPressable } from '../components';
import { auth, db } from '../firebase';
import { addDoc, collection, setDoc, doc } from "firebase/firestore"; 
import { NavigationHelpersContext } from '@react-navigation/native';
import { List } from 'react-native-paper';

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');

    // Todo: email, password states

    const signUpToast = () => {
        ToastAndroid.show(
            'Sign Up successfully completed!',
            ToastAndroid.SHORT
        );
    };

    const missingFieldsToast = () => {
        ToastAndroid.show(
            'Missing fields, please try again!',
            ToastAndroid.SHORT
        );
    };

    const shortPasswordToast = () => {
        ToastAndroid.show(
            'Password needs to be at least 6 characters, please try again!',
            ToastAndroid.SHORT
        );        
    }


    const storeUser = async(uid) => {
        try {
            const userRef = await setDoc(doc(db, uid, 'Data'), {
                displayName: displayName
            });

            console.log('completed', userRef.id);
            
        } catch (err) {
            console.log(err);
        }
    };

    const storeName = () => {
        const auth = getAuth();
        const nameRef = updateProfile(auth.currentUser, {
            displayName: displayName
        }).then(() => {
            console.log('Name updated', nameRef);
            console.log(auth.currentUser);
        }).catch((error) => {
            console.log(error);
        });
    }
    

    const signUpHandler = async () => {
        if (email.length === 0 || password.length === 0 || displayName.length === 0) {
            missingFieldsToast();
            return;
        }

        if (password.length < 6) {
            shortPasswordToast();
            return;
        }

        // Todo return the promise
        return createUserWithEmailAndPassword(auth, email, password).then(uc => { //createUser... returns a promise, then waits for promise to be successful and return user creds
            const user = uc.user; //uc is the promise returned then we wan to get the user
            console.log(user); //see whats the returned obj

            storeUser(user.uid);
            storeName();
            restoreForm(); //clear inputs upon successful sign up & dismiss keyboard
            signUpToast(); //prompt successful sign ups

        }).catch((error) => { //catch any errors, doc in Firebase
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log('[signupHandler]', errorCode, errorMessage);
        });
    };

    const restoreForm = () => {
        setEmail('');
        setPassword('');
        setDisplayName('');
        Keyboard.dismiss();
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            <View style={styles.container}>
                <Text style={[styles.welcomeText, styles.boldText]}>
                    {'Create New Account'}
                </Text>           
                <SwitchPressable
                    onPressHandler={() => navigation.navigate('Login')}
                    title={'Already registered? Click here to login!'}
                />

                <View style={styles.smallContainer}>
                <Text>NAME</Text>
                </View>

                <AuthTextInput
                    value={displayName}
                    placeholder="Your Name"
                    textHandler={setDisplayName}
                />

                <View style={styles.smallContainer}>
                <Text>EMAIL</Text>
                </View>

                <AuthTextInput
                    value={email}
                    placeholder="Your Email"
                    textHandler={setEmail}
                    keyboardType="email-address"
                />

                <View style={styles.smallContainer}>
                <Text>PASSWORD</Text>
                </View>

                <AuthTextInput
                    value={password}
                    placeholder="Your Password"
                    textHandler={setPassword}
                    secureTextEntry
                />

                <AuthPressable
                    onPressHandler={signUpHandler}
                    title={'Sign Up'}
                />

            </View>
        </KeyboardAvoidingView>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff', //#EBECF0
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 40,
    },
    boldText: {
        fontWeight: '300',
    },
    welcomeText: {
        fontSize: 50,
        textAlign: 'center',
        marginBottom: 0,
    },
    /*authText: {
        fontSize: 20,
        marginBottom: 10,
    },*/
    smallContainer: {
        width: '80%',
        paddingBottom: 2
    }
});
