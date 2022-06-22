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
import { TextPressable, Table, TableHeader, SubmitPressable } from '../components';
import { getAuth } from "firebase/auth";

const INPUT_PLACEHOLDER = 'Add your item';
const THEME = '#407BFF';

const { width } = Dimensions.get('window');

const InventoryScreen = ({ navigation }) => {
    const [item, setItem] = useState('');
    const [date, setDate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [itemList, setItemList] = useState([]);

    const [editingRow, setEditingRow] = useState(null);

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
            if (editingRow !== null) {
                onDeleteHandler(editingRow);
            }

            clearForm();
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

            console.log('added', itemRef.id); //print id of the document completed
            
        } catch (error) {
            console.log(error);
        }
    };

    const onDeleteHandler = async (id) => {
        // Todo
        try {
            await deleteDoc(doc(db, user.uid, 'Data', 'inventory', id));
            //doc takes in database, collection name and the id of the doc u want to delete
            if (editingRow === null) {
                showRes('Successfully deleted');
            }

            else {
                showRes('Successfully edited');
                setEditingRow(null);
                console.log('edited', editingRow);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onEditHandler = (item) => {
        setEditingRow(item.id);
        setItem(item.desc);
        setDate(item.date);
        setQuantity(item.quantity);
    };

    const onClearHandler = () => {
        setEditingRow(null);
        clearForm();
        console.log('Action cancelled');
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
                    <Text style={styles.titleText}>Food Inventory List</Text>
                    
                    <View style={styles.listContainer}>
                        <TextPressable
                        onPressHandler={() => navigation.navigate('Food Inventory List')}
                        title={'Check what is expiring soon'}
                        />
                        <TableHeader />
                        <FlatList //will generate a custom component to be able to see each item
                            data={itemList} //see all our items in the itemList
                            renderItem={({ item, index }) => (
                                <Table
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

                    <View style={styles.buttonContainer}>
                    {/*<Pressable
                        onPress={onClearHandler}
                        android_ripple={{ color: 'white' }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{ editingRow === null ? 'Clear' : 'Cancel' }</Text>
                    </Pressable>
                    <Pressable
                        onPress={onSubmitHandler}
                        android_ripple={{ color: 'white' }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{ editingRow === null ? 'Add' : 'Edit' }</Text>
                            </Pressable>*/}

                    <SubmitPressable
                        onPressHandler={onClearHandler}
                        title={ editingRow === null ? 'Clear' : 'Cancel' }
                        width={width}
                    />
                    <SubmitPressable
                        onPressHandler={onSubmitHandler}
                        title={ editingRow === null ? 'Add' : 'Edit' }
                        width={width}
                    />
                    </View>

                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default InventoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', 
     },
    contentContainer: {
        flex: 1,
        //backgroundColor: 'grey', //#FAF9F6
        alignItems :'flex-start',
        paddingHorizontal: 18,
    },
    listContainer: {
        //backgroundColor: 'lightgreen',
        paddingBottom: 20, // Fix: Temporary workaround
        alignItems: 'flex-start',
    },
    list: {
        overflow: 'scroll',
    },
    titleText: {
        fontSize: 35,
        fontWeight: '300',
        marginBottom: 10,
        color: 'black',
    },
    formContainer: {
        //position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        flexDirection: 'row',
        paddingVertical: 5,
        backgroundColor: 'white',
    },
    inputContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        //backgroundColor: 'lightblue',
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
    buttonContainer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignSelf: 'stretch',
    },
    /*button: {
        width: width * 0.21,
        paddingVertical: 13,
        paddingHorizontal: 6,
        backgroundColor: 'black',
        borderRadius: 5,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    },*/
});
