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
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import { AuthTextInput, AuthPressable} from '../components';

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');

    const showRes = (text) => {
        ToastAndroid.show(
            text,
            ToastAndroid.SHORT
        );
    };

    const passwordResetHandler = () => {
        if (email.length === 0) {
            showRes('Missing fields, please try again!');
            return;
        };

    const auth = getAuth();

        return sendPasswordResetEmail(auth, email).then(() => {
                Keyboard.dismiss();
                showRes('Password Reset Email sent! Please check your email!');
                console.log('Password reset email sent');
            })
            .catch((error) => {
                console.error('[passwordResetHandler]', error.code, error.message);

                if (error.code === 'auth/user-not-found') {
                    showRes('Please use the email you used for this account!');
                    return;
                }
    
                if (error.code === 'auth/invalid-email') {
                    showRes('Invalid email, please use a valid email!');
                    return;
                }
                showRes(error.message + 'Please try again');
                
                
            });
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            <View style={styles.container}>
                <Text style={styles.welcomeText}>
                    Forgot/Reset Password?
                </Text>

                <View style={styles.subContainer}>
                <Text style={styles.subtitle}>
                    A password reset email will be sent to your email
                </Text>
                </View>

                <View style={styles.emailContainer}>
                <Text>EMAIL</Text>
                </View>

                <AuthTextInput
                    value={email}
                    placeholder="Your Email"
                    textHandler={setEmail}
                    keyboardType="email-address"
                />

                <AuthPressable
                    onPressHandler={passwordResetHandler}
                    title={'Send password reset email'}
                />

            </View>
        </KeyboardAvoidingView>
    );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 40,
    },
    welcomeText: {
        fontSize: 50,
        textAlign: 'center',
        paddingBottom: 20,
        fontWeight: '300'
    },
    subContainer: {
        width: '80%',
        paddingBottom: 25,
        alignItems: 'center',
    },
    subtitle: {
        justifyContent: 'center',
        textAlign: 'center'
    },
    emailContainer: {
        width: '80%',
        paddingBottom: 2
    },
});
