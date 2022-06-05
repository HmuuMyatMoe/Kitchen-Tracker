import { StyleSheet, View, Pressable, Text, ImageBackground } from 'react-native';
import React from 'react';


const MainScreen = ({ navigation }) => {
    return (
        <View style={styles.container} >
            <ImageBackground 
            source={require('../assets/cover-pg.png')} 
            resizeMode='cover' 
            style={styles.image}
            >
            <Pressable
                style={styles.button}
                onPress={() => navigation.navigate('Auth')}
                android_ripple={styles.ripple}
            >
            <Text style={styles.text}>Welcome! Click To Sign Up/Login</Text>
            </Pressable>
            </ImageBackground>
        </View>
    );
};

export default MainScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'pink', //#EBECF0
        flex: 1,
        paddingVertical: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 20,
        marginVertical: 10,
        paddingVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    text: {
        color: 'black',
        fontWeight: '400',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    ripple: {
        color: '#fff',
        radius: 160,
    }
});
