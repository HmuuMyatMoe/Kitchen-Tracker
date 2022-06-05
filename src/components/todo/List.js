import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const List = (props) => {
    const { data, onDelete } = props;

    const DeleteIcon = () => (
        <TouchableOpacity onPress={() => onDelete(data.id)}>
            <MaterialIcons name="delete" size={28} color="#407BFF" />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, styles.containerShadow]}>
            <Text style={styles.taskText}>{data.item}</Text>
            <DeleteIcon />
        </View>
    );
};

export default List;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightpink',
        flexDirection: 'row',
        marginHorizontal: 14,
        marginVertical: 2,
        paddingVertical: 5,
        paddingHorizontal: 6,
        alignItems: 'center',
        borderRadius: 0,
    },
    containerShadow: {
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    taskText: {
        fontWeight: 'bold',
        flex: 1,
        flexWrap: 'wrap',
        marginRight: 10,
    },
});
