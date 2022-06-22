import { StyleSheet, Text, Pressable } from 'react-native';
import React from 'react';

const SettingsPressable = props => {
    const { onPressHandler, title } = props;

    return (
        <Pressable
            style={styles.button}
            onPress={onPressHandler}
            android_ripple={styles.ripple}
        >
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
};

export default SettingsPressable;

const styles = StyleSheet.create({
    button: {
        paddingTop: 20,
    },
    text: {
        color: 'black',
        textDecorationLine: 'underline',
    },
    ripple: {
        color: 'lightblue',
        radius: 160,
    }
});