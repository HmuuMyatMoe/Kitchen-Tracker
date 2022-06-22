import { StyleSheet, Text, Pressable } from 'react-native';
import React from 'react';

const TextPressable = props => {
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

export default TextPressable;

const styles = StyleSheet.create({
    button: {
        paddingBottom: 20,
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