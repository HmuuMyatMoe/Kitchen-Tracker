import { StyleSheet, View, Text } from 'react-native';
import React from 'react';

const backgroundColor = 'pink';

const TableHeader = () => {
    return (
        <View style={styles.rowContainer}>
            <View style={[styles.cellContainer, {width: '30%'}]}>
            <Text style={styles.cellText}>Name</Text>
            </View>
            <View style={[styles.cellContainer, , {width: '30%'}]}>
            <Text style={styles.cellText}>Expiry Date
            </Text>
            <Text style={styles.cellText}>
            DD/MM/YYYY</Text>
            </View>
            <View style={[styles.cellContainer, {width: '30%'}]}>
            <Text style={styles.cellText}>Quantity</Text>
            </View>
            <View style={styles.fillerContainer}></View>
        </View>
    )
};

export default TableHeader;

const styles = StyleSheet.create({
    rowContainer: {
        backgroundColor: 'pink',
        flexDirection: 'row',
        marginBottom: 1,
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
        borderRadius: 0,
    },
    cellContainer: {
        backgroundColor: backgroundColor,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderEndColor: 'white',
        paddingVertical: 5,
    },
    fillerContainer: {
        backgroundColor: backgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderEndColor: 'pink',
        height: '100%',
        //width: '0%',
    },
    cellText: {
        fontWeight: '300',
        fontSize: 18,
        flexWrap: 'wrap',
        textAlign: 'center',
    },
});

    