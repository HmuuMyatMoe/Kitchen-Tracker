import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    Pressable,
    Dimensions,
    FlatList,
    ToastAndroid,
    Keyboard,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { query, collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

import { db } from '../firebase';
import { Table } from '../components';
import { getAuth } from "firebase/auth";

const INPUT_PLACEHOLDER = 'Add your item';
const THEME = '#407BFF';

const { width } = Dimensions.get('window');

const TableScreen = () => {
    const [item, setItem] = useState('');
    const [itemList, setItemList] = useState([]);
    const [date, setDate] = useState('');
    const [quantity, setQuantity] = useState('');

    const auth = getAuth();
    const user = auth.currentUser;
    if (user === null) {
        while(user === null){
            user = auth.currentUser;
        }
    }

    useEffect(() => {
        // Expensive operation. Consider your app's design on when to invoke this.
        // Could use Redux to help on first application load.
        // Todo: listen to firestore changes
        //create a query obj to pass into onSnapshot to tell firebase what to look at/retrieve from firestore
        const itemQuery = query(collection(db, user.uid, 'Data','inventory'));

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
        if (item.length === 0 || date.length === 0 || quantity.length === 0) {
            showRes('Description cannot be empty!');
            return;
        }

        // Todo, wrap in a try catch to catch any errors when executing this
        try {
            //declare a var itemRef to keep track of whats added
            const itemRef = await addDoc(collection(db, user.uid, 'Data','inventory'), {
                desc: item,
                date: date,
                quantity: quantity, //item is a var we declared on top, which we use to track the input from the text input
            } );
            //addDoc returns a promise ref to the new doc, we nid to wait for the promise endpoint 
            //>> so we use await to wait for the method/func to complete
            //using await means we nid to specify async on top also
            //addDoc - we nid to specify the collection which takes in database instance & collection name (path)
            //also nid to specify the data that u are passing in when u create the doc

            //we didnt specify an id in this case cus we want firebase to make one for us
            //can use uuid (a dependency to create different unit ids)
            clearForm();
            console.log('completed', itemRef.id); //print id of the document completed
            
        } catch (error) {
            console.log(error);
        }
    };

    const onDeleteHandler = async (id) => {
        // Todo
        try {
            await deleteDoc(doc(db, user.uid, 'Data', 'inventory', id));
            //doc takes in database, collection name and the id of the doc u want to delete
            showRes('Successfully deleted');
            console.log('successfully deleted');
        } catch (err) {
            console.log(err);
        }
    };

    const clearForm = () => {
        setItem('');
        setDate('');
        setQuantity('');
        Keyboard.dismiss();
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>
                    <Text style={styles.headerText}>Food Inventory List</Text>
                    <View style={styles.listContainer}>
                        <View style={styles.rowContainer}>
                            <View style={styles.cellContainer}>
                            <Text style={styles.cellText}>Name</Text>
                            </View>
                            <View style={styles.cellContainer}>
                            <Text style={styles.cellText}>Expiry Date</Text>
                            </View>
                            <View style={styles.cellContainer}>
                            <Text style={styles.cellText}>Quantity</Text>
                            </View>
                        </View>
                        <FlatList //will generate a custom component to be able to see each item
                            data={itemList} //see all our items in the itemList
                            renderItem={({ item, index }) => (
                                <Table
                                    data={item} //item wld be like {id: '1', desc: 'buy lunch'}
                                    key={index}
                                    onDelete={onDeleteHandler}
                                />
                            )}
                            style={styles.list}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                    <TextInput
                        onChangeText={setItem}
                        value={item}
                        selectionColor={THEME}
                        placeholder={INPUT_PLACEHOLDER}
                        style={styles.itemInput}
                    />
                    <TextInput
                        onChangeText={setDate}
                        value={date}
                        selectionColor={THEME}
                        placeholder={'Expiry Date'}
                        style={styles.itemInput}
                    />
                    <TextInput
                        onChangeText={setQuantity}
                        value={quantity}
                        selectionColor={THEME}
                        placeholder={'Quantity'}
                        style={styles.itemInput}
                    />
                    </View>
                    <Pressable
                        onPress={onSubmitHandler}
                        android_ripple={{ color: 'white' }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Add</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default TableScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'pink',
        justifyContent: 'center',
     },
    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',
        //#FAF9F6
    },
    listContainer: {
        flex: 1,
        paddingBottom: 20, // Fix: Temporary workaround
    },
    list: {
        overflow: 'scroll',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 30,
        marginLeft: 14,
        marginTop: 14,
        marginBottom: 10,
        color: 'black',
    },
    formContainer: {
        //position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        flexDirection: 'row',
        //paddingHorizontal: 14,
        paddingBottom: 15,
        backgroundColor: '#fff',
    },
    inputContainer: {
        alignItems: 'center',
        flexDirection: 'column'
    },
    itemInput: {
        width: width * 0.7,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginRight: 8,
    },

    button: {
        width: width * 0.2,
        paddingVertical: 10,
        paddingHorizontal: 6,
        backgroundColor: 'black',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    },
    rowContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 1,
        /*paddingVertical: 0,
        paddingHorizontal: 0,*/
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0,
    },
    cellContainer: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0,
        borderEndWidth: 2,
        borderEndColor: 'white',
        height: '100%',
        width: '30%',
    },
    cellText: {
        fontWeight: 'bold',
        flexWrap: 'wrap',
        marginRight: 10,
        marginHorizontal: 5,
    },
});
