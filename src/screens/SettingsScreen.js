import React, { useState, useEffect } from 'react';
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
    Switch
} from 'react-native';

import { MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';

import { db } from '../firebase';
import { getAuth, updateProfile, signOut } from "firebase/auth";
import { query, collection, onSnapshot, addDoc, deleteDoc, doc, getDocs, getDoc } from 'firebase/firestore';
import { SettingsPressable, EditModal, TextPressable, SubmitPressable } from '../components';

//import {useSelector, useDispatch} from 'react-redux'; //useSelecter = i want to access my globalreduxstore and retrieve my countstore?

//import { changeModalState, initialiseModalState } from '../store/count';


const iconColor = 'rgba(0, 60, 37, 0.6)';
const { width } = Dimensions.get('window');

const SettingsScreen = ({ navigation }) => {

    const [settings, setSettings] = useState([]);

    const auth = getAuth();
    const user = auth.currentUser;
    if (user === null) {
        while(user === null){
            user = auth.currentUser;
        }
    };

    useEffect(() => {
        // Expensive operation. Consider your app's design on when to invoke this.
        // Could use Redux to help on first application load.
        // Todo: listen to firestore changes
        //create a query obj to pass into onSnapshot to tell firebase what to look at/retrieve from firestore
        const itemQuery = query(collection(db, user.uid, 'Data','settings'));

        //subscriber to listen to changes
        const subscriber = onSnapshot(itemQuery, (snapshot) => { //snapshot is the snapshot returned by the func
            const items = []; //create a temp var

            //push all data that we received from the snapshot into the items arr
            snapshot.forEach(doc => {
                items.push({ id: doc.id, ...doc.data() }) //want to push in an obj, items will end up being an arr of objs
                //we want the id of each doc, and then destructure all the data for our document
            })

            setSettings([...items]); 
        });

        return subscriber;
    }, []);


    const [ nameModalVisible, setNameModalVisible ] = useState(false);
    const [ notifEnabled, setNotifEnabled ] = useState(false);
    const [ notifDay, setNotifDay ] = useState('');

    const [ newDisplayName, setNewDisplayName ] = useState(user.displayName);

    const changeDisplayNameHandler = () => {
        if (newDisplayName === 0) {
            showRes('Name cannot be empty!');
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
            showRes('Error, please try again');
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
        // Todo: Authentication
        signOut(auth).then(() => {
            setisAuth(false);
        })
    };

    const toggleSwitch = () => {
        setNotifEnabled(previousState => !previousState);
        console.log(notifEnabled);
    }

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

                    <View style={[styles.bigHeaderContainer, {justifyContent:'space-between'}]}>
                        <View style={{flexDirection: 'row'}}>
                            <MaterialCommunityIcons name="bell-outline" size={24} color={iconColor} />
                            <Text style={styles.bigHeaderText}> Notification</Text>
                        </View>

                        <Switch
                            trackColor={{ true: "#003C65", false: "rgba(0, 0, 0, 0.5)" }}
                            thumbColor={notifEnabled ? "pink" : "white"}
                            ios_backgroundColor="#3e3e3e" 
                            onValueChange={() => setNotifEnabled(!notifEnabled)}
                            value={notifEnabled}
                        />            
                    </View>
                    <Text style={styles.smallHeaderText}>Regularly notify me of items that are expiring in</Text>
                    <View style={styles.itemContainer}>
                        <View style={{flexDirection: 'row'}}>
                        <TextInput
                            style={styles.itemText}
                            placeholder={'number of'}
                            keyboardType={'number-pad'}
                            value={notifDay}
                            onChangeText={setNotifDay}
                            selectionColor={'#003C65'}
                        />
                        <Text style={styles.itemText}>day(s)</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Change Email') }>
                            <MaterialCommunityIcons name="calendar-check-outline" size={28} color={iconColor} />
                        </TouchableOpacity>
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
        width: '95%',
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
        paddingBottom: 3,
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
        paddingRight: 5,
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
        //backgroundColor: 'pink',
        //alignSelf: 'stretch',
        justifyContent: 'space-evenly',
    },
    notifChangePressable: {
        alignSelf: 'center',
    },
    notifHeaderContainer: {
        flexDirection: 'row',
        //backgroundColor: 'grey',
        alignSelf: 'stretch',
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 60, 37, 0.2)',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
    },
}); 