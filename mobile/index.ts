import { registerRootComponent } from 'expo';
import { enableScreens } from 'react-native-screens';

import App from './App';

// The Android release build exits when auth switches to the native tab
// navigator. Use React Native views for navigation screens to avoid that
// native screen transition path while keeping React Navigation behavior.
enableScreens(false);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
