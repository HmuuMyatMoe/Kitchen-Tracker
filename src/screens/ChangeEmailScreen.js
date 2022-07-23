import {
    StyleSheet,
    View,
    Text,
    ToastAndroid,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Modal,
    TouchableOpacity,
    TextInput,
    Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { getAuth, updateEmail, signInWithEmailAndPassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

import { AuthTextInput, AuthPressable, SubmitPressable } from '../components';

import { MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ChangeEmailScreen = ({ navigation }) => {

    const auth = getAuth();
    let user = auth.currentUser;
    if (user === null) {
        while(user === null){
            user = auth.currentUser;
        }
    };
    
    const [ newEmail, setNewEmail ] = useState('');
    const [ emailModalVisible, setEmailModalVisible ] = useState(false);

    const [ oldEmail, setOldEmail ] = useState('');
    const [ oldPassword, setOldPassword ] = useState('');

    const showRes = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    };

    const onUpdateHandler = () => {
        if (newEmail.length === 0) {
            showRes('Missing fields, please try again!');
            return;
        };

        if (newEmail === oldEmail) {
            showRes('This is your current email!');
            return;
        };
        setEmailModalVisible(true);
    };

    const reauthenticate = (user, credential) => {
        /*reauthenticateWithCredential(user, credential).then(() => {
            console.log(user);
            console.log('User reauthenticated')
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.error('[reauthenticateHandler]', errorCode, errorMessage);
        });*/

        updateEmail(auth.currentUser, newEmail).then(() => {
            Keyboard.dismiss();
            showRes('Email updated!');
            
            setOldEmail(newEmail);

          }).catch((error) => {
            showRes('Error, please try again');
            const errorCode = error.code;
            const errorMessage = error.message;
                
            console.error('[changeEmailHandler]', errorCode, errorMessage);
          }); 

    };

    const changeEmailHandler = () => {
        if (newEmail.length === 0) {
            showRes('Missing fields, please try again!')
            return;
        };

        signInWithEmailAndPassword(auth, oldEmail, oldPassword).then((uc) => {
            reauthenticate(user, uc);
            setEmailModalVisible(!emailModalVisible);

            console.log('user', user);
            console.log('uc', uc);
            
        }).catch((error) => {
            showRes('Error, please try again!')
            const errorCode = error.code;
            const errorMessage = error.message;

            console.error('[reLoginHandler]', errorCode, errorMessage);
        });
        
    };

    const onClearHandler = () => {
        setNewEmail('');
    };

    const onCancelHandler = () => {
        setEmailModalVisible(!emailModalVisible);
        console.log('Modal closed');
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            <View style={styles.container}>
                <Text style={styles.welcomeText}>
                    Update Email
                </Text>

                <View style={styles.subContainer}>
                <Text style={styles.subtitle}>
                    Key in your new email address below
                </Text>
                </View>

                <View style={styles.emailContainer}>
                <Text>NEW EMAIL</Text>
                </View>

                <AuthTextInput
                    value={newEmail}
                    placeholder="Your Email"
                    textHandler={setNewEmail}
                    keyboardType="email-address"
                />

                <AuthPressable
                    onPressHandler={() => onUpdateHandler()}
                    title={'UPDATE'}
                />

                <View style={styles.modalContainer}>
                    <View style={styles.modalSubContainer}>
                        <Modal
                            animationType='slide'
                            transparent={true}
                            visible={emailModalVisible}
                            onRequestClose={() => {
                                console.log('Modal closed');
                                setEmailModalVisible(!emailModalVisible);
                            }}
                        >
                            
                            <View style={styles.modalContainer}>
                                <View style={styles.modalSubContainer}>
                                    <TouchableOpacity 
                                        onPress={() => onCancelHandler()} 
                                        style={styles.closeModalPressable}
                                    >
                                    <MaterialCommunityIcons name='window-close' size={24} color='black' />
                                    </TouchableOpacity>

                                    <Text style={styles.modalHeader}>Please sign in with your old details again</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        keyboardType={'email-address'}
                                        value={oldEmail}
                                        onChangeText={setOldEmail}
                                        placeholder={'Your old email'}
                                    />
                                    <TextInput
                                        style={styles.textInput}
                                        keyboardType={'default'}
                                        value={oldPassword}
                                        onChangeText={setOldPassword}
                                        placeholder={'Your password'}
                                        secureTextEntry
                                    />
                                    
                                        <View style={styles.modalPressContainer}>
                                            <SubmitPressable
                                                onPressHandler={onClearHandler}
                                                title={'CLEAR'}
                                                width={width * 0.23}
                                            />

                                            <SubmitPressable
                                                onPressHandler={changeEmailHandler}
                                                title={'CONFIRM'}
                                                width={width * 0.23}
                                            />
                                        </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChangeEmailScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff', //#EBECF0
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 50,
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
        textAlign: 'center',
        paddingBottom: 15,
    },
    emailContainer: {
        width: '80%',
        paddingBottom: 2
    },

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalSubContainer: {
        backgroundColor: 'white',
        borderRadius: 30,
        width: '90%',
        paddingVertical: 20,
        alignItems: 'center',
    },
    closeModalPressable: {
        alignSelf: 'flex-end',
        paddingRight: 10,
    },
    modalHeader: {
        fontSize: 30,
        fontWeight: '300',
        alignSelf: 'center',
        paddingBottom: 20,
        textAlign: 'center',
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        height: 50,
        marginTop: 10,
        fontSize: 16,
        alignSelf: 'center',
        width: '90%',
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    modalPressContainer: {
        width: '70%',
        flexDirection: 'row',
        //backgroundColor: 'pink',
        //alignSelf: 'stretch',
        justifyContent: 'space-evenly',
        paddingTop: 20,
    },
});
