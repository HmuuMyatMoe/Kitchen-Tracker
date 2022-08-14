import React, { useState, useEffect } from 'react';
import {
    KeyboardAvoidingView,
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Dimensions,
    ToastAndroid,
} from 'react-native';

import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import { db } from '../firebase';
import { getAuth, updateProfile, signOut } from "firebase/auth";
import { query, collection, onSnapshot } from 'firebase/firestore';
import { TextPressable, SubmitPressable } from '../components';


const iconColor = 'rgba(0, 60, 37, 0.6)';
const { width } = Dimensions.get('window');

const SettingsScreen = ({ navigation }) => {

    const auth = getAuth();
    const user = auth.currentUser;
    if (user === null) {
        while(user === null){
            user = auth.currentUser;
        }
    };

    const [ nameModalVisible, setNameModalVisible ] = useState(false);
    const [ newDisplayName, setNewDisplayName ] = useState(user.displayName);

    const changeDisplayNameHandler = () => {
        if (newDisplayName.length === 0) {
            showRes('Name cannot be empty!');
            return;
        }

        if (newDisplayName === user.displayName) {
            showRes('This is your current name!');
            return;
        }

        const nameRef = updateProfile(auth.currentUser, {
            displayName: newDisplayName
        }).then(() => {
            setNameModalVisible(!nameModalVisible);
            showRes('Name changed!');
            console.log('Name updated', nameRef);
            console.log(auth.currentUser);

        }).catch((error) => {
            console.error('[changeDisplayNameHandler]', error.code, error.message);
            showRes(error.message + 'Please try again.');
            console.log(error);
        });
    };

    const showRes = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    };

    const onCancelHandler = () => {
        setNameModalVisible(false);
        setNewDisplayName(user.displayName);
        showRes('Action cancelled');
        console.log('Action cancelled');
    };

    const ChangeNameIcon = () => (
        <TouchableOpacity onPress={() => { setNameModalVisible(!nameModalVisible) }} >
            <Feather name="edit-2" size={22} color={iconColor} />
        </TouchableOpacity>
        //#407BFF
    );

    const ChangeEmailIcon = () => (
        <TouchableOpacity onPress={() => navigation.navigate('Change Email') }>
            <Feather name="edit-2" size={22} color={iconColor} />
        </TouchableOpacity>
        //#407BFF
    );
    
    const logoutHandler = () => {
        signOut(auth).then(() => {
            setisAuth(false);
        })
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            <SafeAreaView style={styles.container}>
                    
                <View style={styles.subContainer}>
                    <Modal
                        animationType='slide'
                        transparent={true}
                        visible={nameModalVisible}
                        onRequestClose={() => {
                            console.log('Modal closed');
                            setNameModalVisible(!nameModalVisible);
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

                                <Text style={styles.modalHeader}>Change your name</Text>

                                <TextInput
                                    style={styles.textInput}
                                    keyboardType={'default'}
                                    value={newDisplayName}
                                    onChangeText={setNewDisplayName}
                                    selectionColor={'pink'}
                                />
                            
                                <View style={styles.modalPressContainer}>
                                    <SubmitPressable
                                        onPressHandler={onCancelHandler}
                                        title={'CANCEL'}
                                        width={width * 0.22}
                                    />

                                    <SubmitPressable
                                        onPressHandler={changeDisplayNameHandler}
                                        title={'UPDATE'}
                                        width={width * 0.22}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <Text style={styles.titleText}>Settings</Text>
                    <View style={styles.bigHeaderContainer}>
                        <MaterialCommunityIcons name="account-outline" size={24} color={iconColor}/>
                        <Text style={styles.bigHeaderText}> Account</Text>
                    </View>

                    <Text style={styles.smallHeaderText}>Name</Text>
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{user.displayName}</Text>
                        <ChangeNameIcon />
                    </View>

                    <Text style={styles.smallHeaderText}>Email</Text>
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{user.email}</Text>
                        <ChangeEmailIcon />
                    </View>

                    <View style={styles.accPressContainer}>
                    <TextPressable
                        title={'CHANGE PASSWORD'}
                        onPressHandler={() => navigation.navigate('Forgot Password')}
                    />
                    <TextPressable
                        title={'LOGOUT'}
                        onPressHandler={logoutHandler}
                    />
                    </View>
                </View>
                    

            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    subContainer: {
        flex: 1,
        width: '90%',
        alignItems: 'baseline',
    },
    titleText: {
        fontSize: 35,
        marginBottom: 10,
        color: 'black',
        fontWeight: '300',
    },
    bigHeaderContainer: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        height: '7%',
        borderBottomColor: 'rgba(0, 60, 37, 0.2)',
        borderBottomWidth: 1,
    },
    bigHeaderText: {
        fontSize: 18,
        fontWeight: '300',
        color: "black",
        opacity: 0.5,
    },
    smallHeaderText: {
        fontWeight: '300',
        paddingTop: 10,
        paddingBottom: 3,
    },
    itemContainer: {
        borderBottomWidth: 0.8,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemText: {
        color: 'black',
        fontSize: 18,
        paddingRight: 5,
    },
    accPressContainer: {
        paddingBottom: 0,
        paddingTop: 20,
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
        paddingBottom: 30,
    },
    textInput: {
        borderBottomWidth: 1,
        borderColor: 'black',
        height: 30,
        marginTop: 10,
        marginBottom: 30,
        fontSize: 16,
        alignSelf: 'center',
        width: '80%',
        textAlign: 'center',
    },
    modalPressContainer: {
        width: '70%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
}); 