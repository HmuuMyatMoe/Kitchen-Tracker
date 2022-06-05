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
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';

import { AuthTextInput, AuthPressable, SwitchPressable } from '../components';
import { auth } from '../firebase';

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    const loginHandler = () => {
        if (email.length === 0 || password.length === 0) {
            missingFieldsToast();
            return;
        }

        // Todo
        return signInWithEmailAndPassword(auth, email, password).then(uc => {
            const user = uc.user;

            console.log(user);

            restoreForm();
        }).catch((err) => {
            const errCode = err.code;
            const errMessage = err.message;

            console.log('[loginHandler]', errCode, errMessage);
        });
    };

    const signUpHandler = () => {
        if (email.length === 0 || password.length === 0) {
            missingFieldsToast();
            return;
        }

        // Todo return the promise
        return createUserWithEmailAndPassword(auth, email, password).then(uc => { //createUser... returns a promise, then waits for promise to be successful and return user creds
            const user = uc.user; //uc is the promise returned then we wan to get the user

            console.log(user); //see whats the returned obj

            restoreForm(); //clear inputs upon successful sign up & dismiss keyboard
            signUpToast(); //prompt successful sign ups

        }).catch(err => { //catch any errors, doc in Firebase
            const errCode = err.code;
            const errMessage = err.message;

            console.log('[signupHandler]', errCode, errMessage)
        });
    };

    const restoreForm = () => {
        setEmail('');
        setPassword('');
        Keyboard.dismiss();
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            <View style={styles.container}>
                <Text style={[styles.welcomeText, styles.boldText]}>
                    {isLogin ? 'Login' : 'Create New Account'}
                </Text>
                {/*<Text style={[styles.authText, styles.boldText]}>
                    {isLogin ? 'You are logging in!' : 'You are signing up!'}
    </Text> */}              
                <SwitchPressable
                    onPressHandler={() => setIsLogin(!isLogin)}
                    title={isLogin? 'Not a user yet? Click here to register!' : 'Already registered? Click here to login!'}
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
                    onPressHandler={isLogin ? loginHandler : signUpHandler}
                    title={isLogin? 'Login' : 'Sign Up'}
                />

            </View>
        </KeyboardAvoidingView>
    );
};

export default AuthScreen;

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
