import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addListener } from '../utils/redux';
import { View,StyleSheet } from 'react-native';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

const styles = StyleSheet.create({

});

const RootNavigation = StackNavigator(
  {
    MainTabs: { screen: MainTabNavigator },
  },
  {
    // headerMode: 'none',
    initialRouteName: 'MainTabs',
    cardStyle: styles.card,
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  }
);

export default RootNavigation;

// class RootNavigationWithState extends React.PureComponent{
//   static propTypes = {
//     dispatch: PropTypes.func.isRequired,
//     nav: PropTypes.object.isRequired,
//   };
  
//   render() {
//     const { dispatch, nav } = this.props;
//     return (
//       <RootNavigation
//         navigation={addNavigationHelpers({
//           dispatch,
//           state: nav,
//           addListener,
//         })}
//       />
//     );
//   }
// }

// const mapStateToProps = state => ({
//   nav: state.nav,
// });

// export default connect(mapStateToProps)(RootNavigationWithState);