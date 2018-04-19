import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Font } from 'expo';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import store from './utils/store';
import styled from 'styled-components';

import AuthScreen from './components/Auth';
import RootNavigation from './navigation/RootNavigation';
// import RootNavigationWithState from './navigation/RootNavigation';
// import MainTabNavigatorWithState from './navigation/MainTabNavigator';

// const Loader = ()=>(
//   <View>

//   </View>
// )

const LoaderView = styled.View`
  flex:1;
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  /* height: 100;
  width: 100; */
  /* text-align: center; */
`;

export default class App extends React.Component {
  state = {
    fontLoaded: false,
    isAuthenticated: false
  };

  async componentDidMount(){
    await Font.loadAsync({
      'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf'),
      'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
      'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
    });
    this.setState({fontLoaded: true});
  }

  _onAuthenticated = () => {
    this.setState({isAuthenticated: true});
  }
  
  render() {
    const {fontLoaded, isAuthenticated} = this.state;
    
    return !fontLoaded ? (
      <LoaderView>
        <Text> Font loading... </Text>
      </LoaderView>
    ):(          
      <Provider store={store}>
      {
        !isAuthenticated ? (
          <AuthScreen
            _onAuthenticated={this._onAuthenticated}
          />
        ):(
            <View style={styles.container}>
              <RootNavigation/>
            </View>
          
        )
      }
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