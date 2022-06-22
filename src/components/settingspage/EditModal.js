import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Pressable,
    TextInput
} from 'react-native';

import { MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';

const EditModal = (props) => {
    const { oldDisplayName } = props;

    const [ newDisplayName, setNewDisplayName ] = useState(oldDisplayName);

    const changeDisplayNameHandler = () => {

        const nameRef = updateProfile(auth.currentUser, {
            displayName: newDisplayName
        }).then(() => {
            showRes('Name changed!');
            console.log('Name updated', nameRef);
            console.log(auth.currentUser);

        }).catch((error) => {
            console.log(error);
        });
    };

    const showRes = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    };

    const onCancelHandler = () => {
        setNewDisplayName(user.displayName);
        showRes('Action cancelled');
        console.log('Action cancelled');
    };

    return (
        <View style={styles.container}>
        <Text style={styles.modalHeader}>{header}</Text>
        <TextInput
            style={styles.textInput}
            keyboardType={'default'}
            value={newDisplayName}
            onChangeText={setNewDisplayName}
            selectionColor={'pink'}
        />

        <View style={styles.modalPressContainer}>
            <Pressable
                onPressHandler={onCancelHandler}
                title={'CANCEL'}
            />

            <Pressable
                onPressHandler={changeDisplayNameHandler}
                title={'SAVE'}
            />
        </View>
        </View>

    );
}

export default EditModal;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'lightblue',
        justifyContent: 'center'
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
        alignSelf: 'stretch',
        textAlign: 'center',
    },
});

