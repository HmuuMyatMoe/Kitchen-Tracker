import {
    StyleSheet,
    View,
    Text,
    ToastAndroid,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView
} from 'react-native';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { AuthTextInput, AuthPressable, SwitchPressable, ForgetPassPressable } from '../components';
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

        return signInWithEmailAndPassword(auth, email, password).then((uc) => {
            const user = uc.user;

            console.log(user);
            restoreForm();
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.error('[loginHandler]', errorCode, errorMessage);
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
            <SafeAreaView style={styles.container}>
                
                <Text style={[styles.welcomeText, styles.boldText]}>
                    Login
                </Text>

                <SwitchPressable
                    onPressHandler={() => navigation.navigate('Sign Up')}
                    title={'Not a user yet? Click here to register!'}
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

                <ForgetPassPressable
                    onPressHandler={() => navigation.navigate('Forgot Password')}
                    title={'FORGOT PASSWORD?'}
                />

                <AuthPressable
                    onPressHandler={loginHandler}
                    title={'Login'}
                />

                
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white', //#EBECF0
        flex: 1,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40,
    },
    /*subContainer: {
        position: 'relative',
        flexDirection: 'column',
        //backgroundColor: 'pink',
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },*/
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
