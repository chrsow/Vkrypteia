import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import store from './utils/store';

import RootNavigation from './navigation/RootNavigation';
// import RootNavigationWithState from './navigation/RootNavigation';
// import MainTabNavigatorWithState from './navigation/MainTabNavigator';

export default class App extends React.Component {
    
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <RootNavigation/>
          {/* <RootNavigationWithState/> */}
          {/* <MainTabNavigatorWithState/> */}
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stepIndicator: {
    marginVertical:50,
  },
  page: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
});