import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

import React from 'react';

export default App = () => {
      
    console.log("done");
    return ( 
        <>
          <AppNavigator />
          <StatusBar style="auto" />
        </>
    );
};
