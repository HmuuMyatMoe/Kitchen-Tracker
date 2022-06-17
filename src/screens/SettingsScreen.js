import React, { useState, useEffect } from 'react';
import {
    KeyboardAvoidingView,
    View,
    SafeAreaView,
    Text,
    StyleSheet
} from 'react-native';
import { getAuth } from "firebase/auth";
import {DropDownPicker } from 'react-native-dropdown-picker';
import { TextInput } from 'react-native-paper';

const SettingsScreen = () => {

    const auth = getAuth();
    const user = auth.currentUser;
    if (user === null) {
        while(user === null){
            user = auth.currentUser;
        }
    }

    const [accountOpen, setAccountOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: user.displayName , value: 'name'},
        {label: user.email , value: 'email'},
    ]);


    return (
        <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >
                <SafeAreaView style={styles.container}>
                <View>
                    <Text style={styles.text}>Settings</Text>
                </View>
                <DropDownPicker 
                    containerStyle={styles.dropdown}
                    textStyle={styles.dropdowntext}
                    labelStyle={styles.label}
                    open={accountOpen}
                    value={value}
                    items={items}
                    setOpen={setAccountOpen}
                    setValue={setValue}
                    setItems={setItems}
                    onSelectItem={() => {
                        return (
                            <TextInput
                            placeholder={'a'}
                            />
                        )
                    }}
                />
                </SafeAreaView>
            </KeyboardAvoidingView>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        color: '#fff',
        flex: 1,
        alignItems: 'center'
    },
    text: {
        fontSize: 30,
        paddingVertical: 20
    },
    dropdown: {
        width: '90%',
    },
    dropdowntext: {
        fontSize: 20
    },
    label: {
        fontSize: 20,
        color: 'pink'
    }
})