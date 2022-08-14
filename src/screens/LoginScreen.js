import {
    StyleSheet,
    View,
    Text,
    ToastAndroid,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Pressable
} from 'react-native';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { AuthTextInput, AuthPressable, SwitchPressable, ForgetPassPressable } from '../components';
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[secureText, setSecureText] = useState(true);

    const showRes = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    };

    const loginHandler = () => {
        if (email.length === 0 || password.length === 0) {
            showRes('Missing fields, please try again!');
            return;
        }

        return signInWithEmailAndPassword(auth, email, password).then((uc) => {
            const user = uc.user;
            console.log(user);
            
        }).catch((error) => {

            console.error('[loginHandler]', error.code, error.message);

            if (error.code === "auth/user-not-found") {
                showRes("User not found, please register for a new account!");
                return;
            }

            if (error.code === "auth/wrong-password") {
                showRes("Wrong password!");
                return;
            }

            showRes(error.message + 'Please try again.');
        });
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
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'flex-start',
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
    smallContainer: {
        flexDirection: 'row',
        width: '80%',
        paddingBottom: 2,
        justifyContent: 'space-between',
    }
});
