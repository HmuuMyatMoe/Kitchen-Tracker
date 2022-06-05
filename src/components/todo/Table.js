import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const width = Dimensions.get('window');


const Table = (props) => {
    const { data, onDelete } = props;

    const DeleteIcon = () => (
        <TouchableOpacity onPress={() => onDelete(data.id)}>
            <MaterialIcons name="delete" size={28} color="#407BFF" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={styles.cellContainer}>
                <Text style={styles.cellText}>{data.desc}</Text>
                </View>
                <View style={styles.cellContainer}>
                <Text style={styles.cellText}>{data.date}</Text>
                </View>
                <View style={styles.cellContainer}>
                <Text style={styles.cellText}>{data.quantity}</Text>
                </View>
                <DeleteIcon />
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
        backgroundColor: 'white',
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 1,
        /*paddingVertical: 0,
        paddingHorizontal: 0,*/
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0,
    },
    cellContainer: {
        //flex: 1,
        backgroundColor: 'lightpink',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0,
        borderEndWidth: 2,
        borderEndColor: 'white',
        height: '100%',
        width: '30%',
        paddingVertical: 5,
    },
    /*containerShadow: {
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },*/
    cellText: {
        fontWeight: '400',
        color: 'black',
        flexWrap: 'wrap',
        marginHorizontal: 10,
    },
});
