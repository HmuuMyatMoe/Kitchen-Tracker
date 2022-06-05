import { StyleSheet, Text, Pressable } from 'react-native';
import React from 'react';

const SwitchPressable = props => {
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

export default SwitchPressable;

const styles = StyleSheet.create({
    button: {
        marginVertical: 5,
        paddingBottom: 30,
        paddingTop: 20,
        width: '80%',
        alignItems: 'center',
    },
    text: {
        color: 'black'
    },
    ripple: {
        color: 'darkgreen',
        radius: 130
    }
});