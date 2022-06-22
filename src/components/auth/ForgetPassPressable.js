import { StyleSheet, Text, Pressable } from 'react-native';
import React from 'react';

const ForgetPassPressable = props => {
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

export default ForgetPassPressable;

const styles = StyleSheet.create({
    button: {
        paddingVertical: 5,
        width: '80%',
        alignItems: 'flex-start',
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