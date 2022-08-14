import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const width = Dimensions.get('window');

const cellColor = '#FFDAE6';

const Table = props => {
    const { data, onDelete, onEdit } = props;

    const DeleteIcon = () => (
        <TouchableOpacity onPress={() => onDelete(data.id)}>
            <MaterialIcons name="delete" size={28} color="black" />
        </TouchableOpacity>
        //#407BFF
    );

    const EditIcon = () => (
        <TouchableOpacity onPress={() => onEdit(data)}>
            <MaterialIcons name="edit" size={24} color="black" />
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={[styles.cellContainer, {width: '29%'}]}>
                <Text style={styles.cellText}>{data.desc}</Text>
                </View>
                <View style={[styles.cellContainer, {width: '35%'}]}>
                <Text style={styles.cellText}>{data.maskedDate}</Text>
                </View>
                <View style={[styles.cellContainer, {width: '24%'}]}>
                <Text style={styles.cellText}>{data.quantity}</Text>
                </View>
                <View style={styles.buttonContainer}>
                <EditIcon />
                <DeleteIcon />
                </View>
            </View>
        </View>
    );
};

export default Table;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    rowContainer: {
        flex: 1,
        backgroundColor: cellColor,
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 1,
        justifyContent: 'center',
        borderRadius: 0,
    },
    cellContainer: {
        backgroundColor: cellColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0,
        borderEndWidth: 0,
        marginHorizontal: 0,
        borderEndColor: 'pink',
        height: '100%',
        paddingVertical: 5,
    },
    buttonContainer: {
        backgroundColor: cellColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderEndColor: 'pink',
        height: '100%',
        width: '17%',
        paddingVertical: 5,
    },
    cellText: {
        fontWeight: '400',
        color: 'black',
        flexWrap: 'wrap',
        marginHorizontal: 10,
    },
});
