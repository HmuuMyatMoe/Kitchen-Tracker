import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const iconColor = 'rgba(0, 0, 0, 0.6)'; //#407BFF

const List = props => {
    const { data, onDelete, onEdit } = props;

    const DeleteIcon = () => (
        <TouchableOpacity onPress={() => onDelete(data.id)}>
            <MaterialIcons name="delete" size={28} color={iconColor} /> 
        </TouchableOpacity>
    );

    const EditIcon = () => (
        <TouchableOpacity onPress={() => onEdit(data)}>
            <MaterialIcons name="edit" size={24} color={iconColor} />
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.taskText}>{data.desc}</Text>
            <EditIcon />
            <DeleteIcon />
        </View>
    );
};

export default List;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(212,253,214,1)',//#D4FDD6
        marginHorizontal: 14,
        marginVertical: 5,
        paddingVertical: 10,
        paddingHorizontal: 6,
        alignItems: 'center',
        borderRadius: 0,
    },
    taskText: {
        fontSize: 15,
        flex: 1,
        flexWrap: 'wrap',
        marginRight: 10,
    },
});
