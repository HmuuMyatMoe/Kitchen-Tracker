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
import { getAuth } from "firebase/auth";
import { List, SubmitPressable, ItemTextInput } from '../components';

const INPUT_PLACEHOLDER = 'Add your item';
const THEME = '#407BFF';

const { width } = Dimensions.get('window');


const ListScreen = () => {
    const [item, setItem] = useState('');
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

        // Todo, wrap in a try catch to catch any errors when executing this
        try {
            if (editingRow !== null) {
                onDeleteHandler(editingRow);
            }
            
            clearForm();
            //declare a var itemRef to keep track of whats added
            const itemRef = await addDoc(collection(db, user.uid, 'Data', 'to-buy'), {
                desc: item, //item is a var we declared on top, which we use to track the input from the text input
            } );
            //addDoc returns a promise ref to the new doc, we nid to wait for the promise endpoint 
            //>> so we use await to wait for the method/func to complete
            //using await means we nid to specify async on top also
            //addDoc - we nid to specify the collection which takes in database instance & collection name (path)
            //also nid to specify the data that u are passing in when u create the doc

            //we didnt specify an id in this case cus we want firebase to make one for us
            //can use uuid (a dependency to create different unit ids)

            console.log('completed', itemRef.id); //print id of the document completed
            
        } catch (error) {
            console.log(error);
        }
    };

    const onDeleteHandler = async (id) => {
        // Todo
        try {
            await deleteDoc(doc(db, user.uid, 'Data','to-buy', id));
            //doc takes in database, collection name and the id of the doc u want to delete

            if (editingRow === null) {
                showRes('Successfully deleted');
                console.log('successfully deleted');
            }
            else {
                showRes('Sucessfully edited');
                setEditingRow(null);
                console.log('successfully edited', editingRow);
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

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>
                    <Text style={styles.titleText}>To-buy List</Text>
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
                        width={width * 0.21}
                    />
                    <SubmitPressable
                        onPressHandler={onSubmitHandler}
                        title={ editingRow === null ? 'Add' : 'Edit' }
                        width={width * 0.21}
                    />

                    </View>

                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default ListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#fff',
     },
    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',//#FAF9F6
        paddingHorizontal: 5,
    },
    listContainer: {
        flex: 1,
        paddingBottom: 70, // Fix: Temporary workaround
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
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: '#fff',
        justifyContent: 'center',
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
        //backgroundColor: 'pink',
        justifyContent: 'center',
        alignSelf: 'stretch',
        alignContent: 'stretch',
        justifyContent: 'center',
    },
    /*button: {
        width: width * 0.22,
        paddingVertical: 10,
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
