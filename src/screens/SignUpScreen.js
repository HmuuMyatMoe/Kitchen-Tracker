import {
    StyleSheet,
    View,
    Text,
    ToastAndroid,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Pressable,
} from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';

import { AuthTextInput, AuthPressable, SwitchPressable } from '../components';
import { auth, db } from '../firebase';
import { setDoc, doc } from "firebase/firestore"; 

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [secureText, setSecureText] = useState(true);

    const showRes = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    };


    const storeName = () => {
        const auth = getAuth();
        const nameRef = updateProfile(auth.currentUser, {
            displayName: displayName
        }).then(() => {
            
            console.log('Name updated', nameRef);
            console.log(auth.currentUser);

        }).catch((error) => {
            console.error('[storeName]', error.code, error.message);
            showRes(error.message + 'Please try again.');
            console.log(error);
        });
    }
    

    const signUpHandler = async () => {
        if (email.length === 0 || password.length === 0 || displayName.length === 0) {
            showRes('Missing fields, please try again!');
            return;
        }

        if (password.length < 6) {
            showRes('Password needs to be at least 6 characters, please try again!');
            return;
        }

        // Todo return the promise
        return createUserWithEmailAndPassword(auth, email, password).then(uc => { //createUser... returns a promise, then waits for promise to be successful and return user creds
            const user = uc.user; //uc is the promise returned then we wan to get the user
            console.log(user); //see whats the returned obj

            storeName();
            restoreForm(); //clear inputs upon successful sign up & dismiss keyboard
            showRes('Sign Up successfully completed!') //prompt successful sign ups

        }).catch((error) => { //catch any errors

            console.error('[signupHandler]', error.code, error.message);

            if (error.code === 'auth/email-already-in-use') {
                showRes('Email already in use, please login or use another email!');
                return;
            }

            if (error.code === 'auth/invalid-email') {
                showRes('Invalid email, please use a valid email!');
                return;
            }

            showRes(error.message + 'Please try again.');
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
            style={{ 
                flex: 1,
                backgroundColor: 'white',
            }}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            contentContainerStyle={{
                flex: 1,
                backgroundColor: 'white',
            }}
        >
            <SafeAreaView style={styles.container}>
                
                <Text style={[styles.welcomeText, styles.boldText]}>
                    {'Register'}
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
    
                <Pressable
                    onPressIn={() => setSecureText(false)}
                    onPressOut={() => setSecureText(true)}
                    android_ripple={{ color: 'green' }}
                >
                    <Text>SHOW</Text>
                </Pressable>
                </View>

                <AuthTextInput
                    value={password}
                    placeholder="Your Password"
                    textHandler={setPassword}
                    secureTextEntry={secureText}
                />

                <AuthPressable
                    onPressHandler={signUpHandler}
                    title={'Sign Up'}
                />
                

            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 30,
    },
    boldText: {
        fontWeight: '300',
    },
    welcomeText: {
        fontSize: 50,
        textAlign: 'center',
    },
    smallContainer: {
        flexDirection: 'row',
        width: '80%',
        paddingBottom: 2,
        justifyContent: 'space-between'
    },
});
