import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    Dimensions,
    FlatList,
    ToastAndroid,
    Keyboard,
    Modal
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { query, collection, onSnapshot, addDoc, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';

import { db } from '../firebase';
import { getAuth } from "firebase/auth";
import { Table, List, SubmitPressable, ItemTextInput, TextPressable } from '../components';

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { searchFor, crossCheck } from '../components/foodinventory/ListFunctions';

const THEME = '#407BFF';

const { width } = Dimensions.get('window');


const ListScreen = () => {
    const [item, setItem] = useState('');
    const [itemList, setItemList] = useState([]);
    const [editingRow, setEditingRow] = useState(null);

    const [search, setSearch] = useState(null);
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [searchedList, setSearchedList] = useState([]);

    const [checkModalVisible, setCheckModalVisible] = useState(false);
    const [checkedList, setCheckedList] = useState([]);

    const auth = getAuth();
    const user = auth.currentUser;
    if (user === null) {
        while(user === null){
            user = auth.currentUser;
        }
    }
    
    useEffect(() => {
        // listen to firestore changes
        //create a query obj to pass into onSnapshot to tell firebase what to look at/retrieve from firestore
        const itemQuery = query(collection(db, user.uid, 'Data','to-buy'));

        //subscriber to listen to changes
        const subscriber = onSnapshot(itemQuery, (snapshot) => { //snapshot is the snapshot returned by the func
            const items = []; //create a temp var

            //push all data that we received from the snapshot into the items arr
            snapshot.forEach(doc => {
                items.push({ id: doc.id, ...doc.data() }) //want to push in an obj, items will end up being an arr of objs
                //we want the id of each doc, and then destructure all the data for our document
            })

            setItemList([...items]); 
        });

        return subscriber;
    }, []);

    const showRes = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    };

    // https://firebase.google.com/docs/firestore/manage-data/add-data#web-version-9
    // https://firebase.google.com/docs/firestore/manage-data/add-data#web-version-9_7
    //async is needed since we used await
    const onSubmitHandler = async () => {
        if (item.length === 0) {
            showRes('Description cannot be empty!');
            return;
        }

        //wrap in a try catch to catch any errors when executing this
        try {
            if (editingRow !== null) {
                onDeleteHandler(editingRow);
                setEditingRow(null);
                console.log('successfully edited', editingRow);
            }
            
            clearForm();
            //declare a var itemRef to keep track of whats added
            await setDoc(doc(db, user.uid, 'Data', 'to-buy',(item + Date())), {
                desc: item, //item is a var we declared on top, which we use to track the input from the text input
            } );
            //addDoc returns a promise ref to the new doc, we nid to wait for the promise endpoint 
            //>> so we use await to wait for the method/func to complete
            //using await means we nid to specify async on top also
            
        } catch (error) {
            console.error('[onSubmitHandler]', error.code, error.message);
            showRes(error.message + 'Please try again.');
            console.log(error);
        }
    };

    const onDeleteHandler = async (id) => {
        try {
            await deleteDoc(doc(db, user.uid, 'Data','to-buy', id));
            //doc takes in database, collection name and the id of the doc u want to delete

            if (editingRow === null) {
                showRes('Successfully deleted');
                console.log('successfully deleted');
            }
            else {
                showRes('Sucessfully edited');
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onEditHandler = (item) => {
        setEditingRow(item.id);
        setItem(item.desc);
    };

    const onClearHandler = () => {
        setEditingRow(null);
        clearForm();
        console.log('Action cancelled');
    };

    const clearForm = () => {
        setItem('');
        Keyboard.dismiss();
    };

    const searchHandler = () => {
        if (search === '') {
            showRes('Please enter an item');
            return;
        };

        console.log(search);

        const searched = searchFor(itemList, search);
        setSearchedList(searched);


        if (searched.length === 0) {
            showRes('There is no such item in the list');
            return;
        }

        setSearchModalVisible(!searchModalVisible);
        console.log("searched" , searchedList);
    };

    const onCloseSearchModalHandler = () => {
        setSearch('');
        setSearchedList([]);

        setSearchModalVisible(!searchModalVisible);
        console.log('closed', search);
    };

    const checkHandler = async () => {
        
        const querySnapshot = await getDocs(collection(db, user.uid, 'Data','inventory'));
        
        const inventoryList = [];

        querySnapshot.forEach(doc => {
            inventoryList.push({ id: doc.id, ...doc.data() }) //want to push in an obj, items will end up being an arr of objs
            //we want the id of each doc, and then destructure all the data for our document
        })

        const checked = crossCheck(inventoryList, itemList);
        setCheckedList(checked);

        if (checked.length === 0) {
            showRes('There is no overlaps between the two lists');
            return;
        }

        setCheckModalVisible(!checkModalVisible);
        console.log("checked" , checkedList);
    };

    const onCloseCheckModalHandler = () => {
        setCheckedList([]);
        
        setCheckModalVisible(!checkModalVisible);
        console.log('closed', checkedList);
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            <SafeAreaView style={styles.container}>
                
                <Text style={styles.titleText}>To-buy List</Text>

                <View style={styles.subHeaderContainer}>
                    <View style={styles.checkContainer}>
                        <TextPressable
                        onPressHandler={checkHandler}
                        title={'Click here'}
                        />
                        <Text style={styles.subtitle}> to cross check with Food Inventory List</Text>
                    </View>

                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder={'Search'}
                            value={search}
                            onChangeText={setSearch}
                            selectionColor={THEME} 
                            onSubmitEditing={searchHandler}
                        />
                        <TouchableOpacity 
                            onPress={searchHandler}
                        >
                            <MaterialIcons name='search' size={27} color='black' />
                        </TouchableOpacity>
                    </View>        
                </View>

                <View style={styles.listContainer}>
                    <FlatList //will generate a custom component to be able to see each item
                        data={itemList} //see all our items in the itemList
                        renderItem={({ item, index }) => (
                            <List
                                data={item} //item wld be like {id: '1', desc: 'buy lunch'}
                                key={index}
                                onDelete={onDeleteHandler}
                                onEdit={onEditHandler}
                            />
                        )}
                        style={styles.list}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                <View style={styles.formContainer}>
                    <ItemTextInput
                        keyboardType={'default'}
                        placeholder={'Add your item'}
                        value={item}
                        textHandler={setItem}
                        width={width * 0.7}
                        height={'60%'}
                    />

                    <View style={styles.buttonContainer}>
                        <SubmitPressable
                            onPressHandler={onClearHandler}
                            title={ editingRow === null ? 'Clear' : 'Cancel' }
                            width={width * 0.21}
                        />
                        <SubmitPressable
                            onPressHandler={onSubmitHandler}
                            title={ editingRow === null ? 'Add' : 'Edit' }
                            width={width * 0.21}
                        />
                    </View>
                </View>
            
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={searchModalVisible}
                    onRequestClose={() => {
                        console.log('Modal closed');
                        setSearchModalVisible(!searchModalVisible);
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalSubContainer}>
                            <TouchableOpacity 
                                onPress={onCloseSearchModalHandler} 
                                style={styles.closeModalPressable}
                            >
                                <MaterialCommunityIcons name='window-close' size={24} color='black' />
                            </TouchableOpacity>
                            <Text style={styles.modalHeader}>Results for "{search}"</Text>
                        
                            <FlatList 
                                data={searchedList} 
                                renderItem={({ item, index }) => (
                                    <List
                                        data={item} 
                                        key={index}
                                        onDelete={onDeleteHandler}
                                        onEdit={onEditHandler}
                                    />
                                )}
                                style={styles.list}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={checkModalVisible}
                    onRequestClose={() => {
                        console.log('Modal closed');
                        setCheckModalVisible(!checkModalVisible);
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalSubContainer}>
                            <TouchableOpacity 
                                onPress={onCloseCheckModalHandler} 
                                style={styles.closeModalPressable}
                            >
                                <MaterialCommunityIcons name='window-close' size={24} color='black' />
                            </TouchableOpacity>
                            <Text style={styles.modalHeader}>Items you already have</Text>
                        
                            <FlatList 
                                data={checkedList} 
                                renderItem={({ item, index }) => (
                                    <Table
                                        data={item} 
                                        key={index}
                                        onDelete={() => showRes('Please delete item in the Food Inventory List page!')}
                                        onEdit={() => showRes('Please edit item in the Food Inventory List page!')}
                                    />
                                )}
                                style={styles.list}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </Modal>

            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default ListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 5,
     },
    subHeaderContainer: {
        flexDirection: 'column',
        paddingTop: 15,
    },
    checkContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingLeft: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        paddingRight: 15,
        alignSelf: 'flex-end',
    },
    searchInput: {
        marginHorizontal: 5,
        borderBottomWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 5,
        textAlign: 'center',
        alignSelf: 'flex-start',
    },
    listContainer: {
        flex: 1,
        paddingBottom: 10,
    },
    list: {
        overflow: 'scroll',
    },
    titleText: {
        fontSize: 35,
        fontWeight: '300',
        marginLeft: 14,
        marginBottom: 10,
        color: 'black',
    },
    formContainer: {
        bottom: 0,
        flexDirection: 'row',
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    itemInput: {
        width: width * 0.7,
        height: '60%',
        borderWidth: 2,
        borderRadius: 20,
        borderColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginRight: 8,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignSelf: 'stretch',
        alignContent: 'stretch',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalSubContainer: {
        backgroundColor: 'white',
        paddingVertical: 20,
        alignItems: 'center',
        width: '96%',
        borderRadius: 15,
        alignItems: 'stretch'
    },
    closeModalPressable: {
        alignSelf: 'flex-end',
        paddingRight: 10,
    },
    modalHeader: {
        fontSize: 30,
        fontWeight: '300',
        marginBottom: 10,
        color: 'black',
        textAlign: 'center',
        paddingHorizontal: 20,
        paddingTop: 5,
        paddingBottom: 20,
    },
});
