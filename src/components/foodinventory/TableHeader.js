import { StyleSheet, View, Text } from 'react-native';
import React from 'react';

const backgroundColor = 'pink';

const TableHeader = props => {
    return (
        <View style={styles.rowContainer}>
            <View style={[styles.cellContainer, {width: '30%'}]}>
            <Text style={styles.cellText}>Name</Text>
            </View>
            <View style={[styles.cellContainer, , {width: '36%'}]}>
            <Text style={styles.cellText}>Expiry Date
            DD/MM/YYYY</Text>
            </View>
            <View style={[styles.cellContainer, {width: '25%'}]}>
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
        marginHorizontal: 5,
        marginBottom: 1,
        //borderBottomWidth: 2,
        //borderBottomColor: 'black',
        /*paddingVertical: 0,
        paddingHorizontal: 0,*/
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        borderRadius: 0,
    },
    cellContainer: {
        backgroundColor: backgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderEndColor: 'white',
        height: '100%',
        //width: '30%',
    },
    fillerContainer: {
        backgroundColor: backgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderEndColor: 'pink',
        height: '100%',
        width: '10.5%',
        //paddingVertical: 5,
    },
    cellText: {
        fontWeight: '500',
        flexWrap: 'wrap',
        marginRight: 10,
        marginHorizontal: 5,
        textAlign: 'center',
    },
});

    