import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Pressable,
    TextInput,
    Dimensions,
    Keyboard,
    ToastAndroid,
} from 'react-native';

import { MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';

import { db } from '../firebase';
import { getAuth, updateProfile, updateEmail, reauthenticateWithCredential } from "firebase/auth";
import { SettingsPressable, EditModal, TextPressable, SubmitPressable } from '../components';

//import {useSelector, useDispatch} from 'react-redux'; //useSelecter = i want to access my globalreduxstore and retrieve my countstore?

//import { changeModalState, initialiseModalState } from '../store/count';


const iconColor = 'rgba(0, 60, 37, 0.6)';
const { width } = Dimensions.get('window');

const SettingsScreen = ({ navigation }) => {

    const [ nameModalVisible, setNameModalVisible ] = useState(false);
    const [ emailModalVisible, setEmailModalVisible ] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;
    if (user === null) {
        while(user === null){
            user = auth.currentUser;
        }
    }

    const [ newDisplayName, setNewDisplayName ] = useState(user.displayName);
    const [ newEmail, setNewEmail ] = useState(user.email);

    const changeDisplayNameHandler = () => {
        const nameRef = updateProfile(auth.currentUser, {
            displayName: newDisplayName
        }).then(() => {
            setNameModalVisible(!nameModalVisible);
            showRes('Name changed!');
            console.log('Name updated', nameRef);
            console.log(auth.currentUser);

        }).catch((error) => {
            showRes('Error, please try again');
            console.log(error);
        });
    };

    const changeEmailHandler = () => {
        const credentials = getAuth();

        reauthenticateWithCredential(user, credentials.currentuser).then(() => {
        // User re-authenticated.
        }).catch((error) => {
        // An error ocurred
        // ...
        });

        const auth = getAuth();
        updateEmail(auth.currentUser, newEmail).then(() => {
            setEmailModalVisible(!emailModalVisible);
            showRes('Email updated!');
            //console.log('Name updated', emailRef);
            //console.log(auth.currentUser);
          }).catch((error) => {
            showRes('Error, please try again');
            console.log(error);
          });
          
    };

    const showRes = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    };

    const onCancelHandler = () => {
        setNameModalVisible(false);
        setEmailModalVisible(false);
        setNewDisplayName(user.displayName);
        setNewEmail(user.email);
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
        <TouchableOpacity onPress={() => { setEmailModalVisible(!emailModalVisible) }}>
            <Feather name="edit-2" size={22} color={iconColor} />
        </TouchableOpacity>
        //#407BFF
    );
    


    return (
        <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >
                <SafeAreaView style={styles.container}>
                    
                <View style={styles.subContainer}>
                    {/*<EditModal />*/}
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
                                    width={width}
                                />

                                <SubmitPressable
                                    onPressHandler={changeDisplayNameHandler}
                                    title={'SAVE'}
                                    width={width}
                                />
                            </View>
                        </View>
                    </View>
                    </Modal>

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

                            <Text style={styles.modalHeader}>Change your email</Text>
                            <TextInput
                                style={styles.textInput}
                                keyboardType={'default'}
                                value={newEmail}
                                onChangeText={setNewEmail}
                                selectionColor={'pink'}
                            />
                            
                            <View style={styles.modalPressContainer}>
                                <SubmitPressable
                                    onPressHandler={onCancelHandler}
                                    title={'CANCEL'}
                                    width={width}
                                />

                                <SubmitPressable
                                    onPressHandler={changeEmailHandler}
                                    title={'SAVE'}
                                    width={width}
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
                    />
                    </View>

                    <View style={styles.bigHeaderContainer}>
                        <MaterialCommunityIcons name="bell-outline" size={24} color={iconColor} />
                        <Text style={styles.bigHeaderText}> Notification</Text>
                    </View>
                    <View style={styles.bigHeaderContainer}>
                        <MaterialCommunityIcons name="palette-outline" size={24} color={iconColor} />
                        <Text style={styles.bigHeaderText}> Theme</Text>
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
        //backgroundColor: 'pink',
    },
    titleText: {
        fontSize: 35,
        marginBottom: 10,
        color: 'black',
    },
    bigHeaderContainer: {
        flexDirection: 'row',
        //backgroundColor: 'grey',
        alignSelf: 'stretch',
        alignItems: 'center',
        height: '7%',
        borderBottomColor: 'rgba(0, 60, 37, 0.2)',
        borderBottomWidth: 1,
    },
    bigHeaderText: {
        fontSize: 18,
        fontWeight: '300',
        color: "black", //#003C25
        opacity: 0.5,
    },
    smallHeaderText: {
        fontWeight: '300',
        paddingTop: 10,
    },
    itemContainer: {
        //backgroundColor: 'lightblue',
        borderBottomWidth: 0.8,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemText: {
        color: 'black',
        fontSize: 18,
    },
    accPressContainer: {
        //backgroundColor: 'lightblue',
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
        //paddingHorizontal: 8,
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
        backgroundColor: 'pink',
        //alignSelf: 'stretch',
        justifyContent: 'space-evenly',
    }

}); 