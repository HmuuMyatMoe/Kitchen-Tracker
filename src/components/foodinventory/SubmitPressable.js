import { StyleSheet, Text, Pressable } from 'react-native';
import React from 'react';

const SubmitPressable = props => {
    const { onPressHandler, title, width } = props;

    return (
        <Pressable
            style={[styles.button, {width: width*0.21}]}
            onPress={onPressHandler}
            android_ripple={{ color: 'white'}}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );
};

export default SubmitPressable;

const styles = StyleSheet.create({
    button: {
        paddingVertical: 13,
        backgroundColor: 'black',
        borderRadius: 5,
        marginBottom: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    },
});