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
    Modal,
    TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { query, collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

import { db } from '../firebase';
import { TextPressable, Table, TableHeader, SubmitPressable, ItemTextInput } from '../components';
import { getAuth } from "firebase/auth";

import MaskInput, { Masks } from 'react-native-mask-input';
import { MaskService } from 'react-native-masked-text';

import DropDownPicker from 'react-native-dropdown-picker';

import { MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';

import { checkDate } from '../components/foodinventory/CheckExp';


const INPUT_PLACEHOLDER = 'Add your item';
const THEME = 'rgba(0, 60, 37, 0.4)'; //#407BFF

const { width } = Dimensions.get('window');

const InventoryScreen = ({ navigation }) => {

    const [item, setItem] = useState('');
    const [maskedDate, setMaskedDate] = useState('');
    const [unmaskedDate, setUnmaskedDate] = useState('');
    const [quantity, setQuantity] = useState('');

    const [itemList, setItemList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

    const [editingRow, setEditingRow] = useState(null);

    const [numDays, setNumDays] = useState(null);
    const [checkModalVisible, setCheckModalVisible] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;
    if (user === null) {
        while(user === null){
            user = auth.currentUser;
        };
    };

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
            //console.log('itemList' , itemList[0].flippedDate);
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
        if (item.length === 0 || unmaskedDate.length < 8 || quantity.length === 0) {
            showRes('Description cannot be empty/incomplete!');
            return;
        }

        const flippedDate = checkDate(unmaskedDate);

        if ( flippedDate === null ) {
            showRes('Please enter a valid expiry date!');
            return;
        }

        if ( flippedDate === false ){
            showRes('Item is already expired!');
            return;
        }

        if (quantity === '0') {
            showRes('Quantity cannot be 0!');
            return;
        }

        // Todo, wrap in a try catch to catch any errors when executing this
        try {
            if (editingRow !== null) {
                onDeleteHandler(editingRow);
                setEditingRow(null);
                console.log('edited', editingRow);
            }

            clearForm();
            //declare a var itemRef to keep track of whats added
            const itemRef = await addDoc(collection(db, user.uid, 'Data','inventory'), {
                desc: item,
                maskedDate: maskedDate,
                unmaskedDate: unmaskedDate,
                flippedDate : flippedDate,
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
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onEditHandler = (item) => {
        setEditingRow(item.id);
        setItem(item.desc);
        setMaskedDate(item.maskedDate);
        setUnmaskedDate(item.unmaskedDate);
        setQuantity(item.quantity);
    };

    const onClearHandler = () => {
        setEditingRow(null);
        clearForm();
        console.log('Action cancelled');
    };

    const clearForm = () => {
        setItem('');
        setMaskedDate('');
        setUnmaskedDate('');
        setQuantity('');
        Keyboard.dismiss();
    };

    const checkExpSoonHandler = () => {
        const num = parseInt(numDays);
        if (isNaN(num) || num < 0) {
            showRes('Please enter a valid number of days');
            return;
        };
        if (num > 365) {
            showRes('Please enter a smaller number');
            return;
        };
        checkExpiring(itemList, num);
        setCheckModalVisible(!checkModalVisible);
        console.log(filteredList);
    };

    const checkExpiring = (itemList, numDays) => {
        const endDate = new Date(new Date().getTime() + (numDays*24*60*60*1000));
    
        const dd = String(endDate.getDate()).padStart(2, '0');
        const mm = String(endDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = endDate.getFullYear();
    
        const flippedEndDate = yyyy + mm + dd;
        console.log(flippedEndDate);
    
        const filtered = [];
    
        let numItems = itemList.length;
        let i = 0;
    
        while (i < numItems) {
            if (itemList[i].flippedDate <= flippedEndDate) {
                filtered.push(itemList[i])
            }
            i += 1;
        }
        setFilteredList([...filtered]);   
    };

    const onCloseModalHandler = () => {
        setFilteredList([]);
        
        setCheckModalVisible(!checkModalVisible);
        console.log('closed', filteredList);
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            <SafeAreaView style={styles.container}>

                <View style={styles.headContainer}>
                    <Text style={styles.titleText}>Food Inventory List</Text>
                        <View style={styles.checkExpSoonContainer}>
                            <TextPressable
                            onPressHandler={checkExpSoonHandler}
                            title={'Click here'}
                            />
                            <Text style={styles.subtitle}>to check items expiring in</Text>
                            <TextInput
                                style={styles.numDaysInput}
                                placeholder={'no. of days'}
                                keyboardType={'number-pad'}
                                value={numDays}
                                onChangeText={setNumDays}
                                selectionColor={THEME} 
                            />
                            <Text style={styles.subtitle}>days</Text>
                        </View>

                        <View style={styles.listContainer}>
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
                            onPress={onCloseModalHandler} 
                            style={styles.closeModalPressable}
                        >
                        <MaterialCommunityIcons name='window-close' size={24} color='black' />
                        </TouchableOpacity>
                        <Text style={styles.modalHeader}>Items expiring in {numDays} days</Text>
                        <TableHeader />
                        <FlatList 
                            data={filteredList} 
                            renderItem={({ item, index }) => (
                                <Table
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

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                    <ItemTextInput
                        keyboardType={'default'}
                        placeholder={'Add your item'}
                        value={item}
                        textHandler={setItem}
                        width={width * 0.7}
                    />
                    <MaskInput
                        value={maskedDate}
                        onChangeText={(masked, unmasked) => {
                            setUnmaskedDate(unmasked);
                            //console.log('unmasked', unmasked);
                            setMaskedDate(masked);
                            //console.log('masked', masked);
                        }}
                        //mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, '/']}
                        mask={Masks.DATE_DDMMYYYY}
                        style={styles.itemInput}
                        placeholder={'Expiry Date (DD/MM/YYYY)'}
                        selectionColor={THEME}
                        keyboardType={'number-pad'}
                    />
                    <ItemTextInput
                        keyboardType={'number-pad'}
                        placeholder={'Quantity'}
                        value={quantity}
                        textHandler={setQuantity}
                        width={width * 0.7}
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

export default InventoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
     },
    headContainer: {
        flex: 1,
        //backgroundColor: 'grey', //#FAF9F6
        alignItems :'flex-start',
        paddingHorizontal: 18,
    },
    checkExpSoonContainer: {
        //backgroundColor: 'orange',
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    numDaysInput: {
        marginHorizontal: 5,
        borderBottomWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 5,
        textAlign: 'center',
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    subtitle: {
        paddingBottom: 20,
        paddingLeft: 4,
    },
    listContainer: {
        //backgroundColor: 'lightgreen',
        paddingBottom: 115, // Fix: Temporary workaround
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        alignContent: 'stretch',
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
