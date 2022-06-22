import { StyleSheet, View, Text } from 'react-native';
import React from 'react';

const backgroundColor = 'pink';

const TableHeader = props => {
    return (
        <View style={styles.rowContainer}>
            <View style={styles.cellContainer}>
            <Text style={styles.cellText}>Name</Text>
            </View>
            <View style={styles.cellContainer}>
            <Text style={styles.cellText}>Expiry Date</Text>
            </View>
            <View style={styles.cellContainer}>
            <Text style={styles.cellText}>Quantity</Text>
            </View>
            <View style={styles.fillerContainer}></View>
        </View>
    )
};

export default TableHeader;

const styles = StyleSheet.create({
    rowContainer: {
        backgroundColor: backgroundColor,
        flexDirection: 'row',
        marginHorizontal: 10,
        marginBottom: 1,
        //borderBottomWidth: 2,
        //borderBottomColor: 'black',
        /*paddingVertical: 0,
        paddingHorizontal: 0,*/
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 0,
    },
    cellContainer: {
        backgroundColor: backgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderEndColor: 'white',
        height: '100%',
        width: '29%',
    },
    fillerContainer: {
        backgroundColor: backgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderEndColor: 'pink',
        height: '100%',
        width: '16%',
        paddingVertical: 5,
    },
    cellText: {
        fontWeight: '500',
        flexWrap: 'wrap',
        marginRight: 10,
        marginHorizontal: 5,
    },
});

    