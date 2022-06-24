import { StyleSheet, TextInput } from 'react-native';
import React from 'react';

const THEME = 'rgba(0, 60, 37, 0.2)'; //#3F3F3F

const ItemTextInput = props => {
    const { keyboardType, placeholder, value, textHandler, width, height } =
        props;

    return (
        <TextInput
            style={[styles.textInput, {width: width}, {height: height}]}
            placeholder={placeholder}
            keyboardType={keyboardType}
            value={value}
            onChangeText={textHandler}
            selectionColor={THEME}
        />
    );
};

export default ItemTextInput;

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 2,
        borderRadius: 20,
        borderColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginRight: 8,
    }
});
