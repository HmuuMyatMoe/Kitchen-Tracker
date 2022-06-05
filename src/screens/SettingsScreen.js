import React from "react";
import {
    KeyboardAvoidingView,
    View,
    SafeAreaView,
    Text,
    StyleSheet
} from 'react-native';

const SettingsScreen = () => {
    return (
        <KeyboardAvoidingView
                style={{flex: 1, color: 'white'}}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >
                <SafeAreaView style={styles.container}>
                <View>
                    <Text style={styles.text}>Settings</Text>
                </View>
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
        fontSize: 20
    }
})