import { StatusBar } from 'expo-status-bar';
/*Provider is like a top level component
import { store } from './src/store/store';
import { Provider } from 'react-redux'; //to initialise global store
import { SafeAreaProvider } from 'react-native-safe-area-context';*/

import { LogBox } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';
//import { store } from './src/store/store';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default App = () => {
    console.log("done");
    return ( //set store, so that entire app hv access to the redux store
        <>
            <AppNavigator />
            <StatusBar style="auto" />
        </>
    );
};
