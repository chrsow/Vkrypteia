import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addListener } from '../utils/redux';
import { Image, StyleSheet } from 'react-native';
import { TabNavigator, addNavigationHelpers } from 'react-navigation';
import { MaterialIcons, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import NavigationEvents from '../utils/NavigationEvents';
import TabBarBottom from './TabBarBottom';

import VotingScreen from '../components/Voting/VotingScreen';
import ProfileScreen from '../components/Profile/ProfileScreen';
import HistoryScreen from '../components/History/HistoryScreen';
import { Colors, Layout } from '../components/Common';

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 1,
    paddingHorizontal: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.tabIconDefault,
  },
  tabBarLabel: {
    fontSize: 10,
    letterSpacing: 0,
  },
  header: {
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fafafa',
  },
});

class TabIcon extends React.Component {
  render() {
    switch (this.props.set) {
      case 1:
        return (
          <MaterialIcons
            name={this.props.name}
            size={this.props.size || 26}
            color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        )
      case 2:  
        return (
          <Foundation
            name={this.props.name}
            size={this.props.size || 26}
            color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        )
      case 3:
        return (
          <MaterialCommunityIcons
            name={this.props.name}
            size={this.props.size || 26}
            color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        )
      default:
        return null;
    }
      

  }
}


const MainTabNavigator = TabNavigator(
  {
    Voting:{
      screen: VotingScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Voting'
      })
    },
    History:{
      screen: HistoryScreen
    },
    Profile: {
      screen: ProfileScreen
    }
  },
  {
    navigationOptions: ({navigation}) => ({
      header: null,
      tabBarLabel: () => {
        const { routeName } = navigation.state;
        return routeName;
        // if (routeName === 'Voting') {
        //   // return Layout.isSmallDevice ? 'RN Core' : 'React Native Core';
        // } else if (routeName === 'ExpoComponents') {
        //   return Layout.isSmallDevice ? 'Components' : 'Expo Components';
        // } else if (routeName === 'ExpoApis') {
        //   return Layout.isSmallDevice ? 'APIs' : 'Expo APIs';
        // }
      },
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        if (routeName === 'Voting') {
          return <TabIcon set={1} name="group-work" focused={focused}/>;
        } else if (routeName === 'History') {
          return <TabIcon set={2} name='results' focused={focused} size={25} />;
        } else if (routeName === 'Profile') {
          return <TabIcon set={3} name='face-profile' focused={focused} size={28} />;
        }
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    headerMode: 'none',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      activeTintColor: Colors.tabIconSelected,
      inactiveTintColor: Colors.tabIconDefault,
      style: styles.tabBar,
      labelStyle: styles.tabBarLabel,
      onPressTab: (index, previousIndex, navigation, onComplete) => {
        if (previousIndex === index) {
          let route = navigation.state.routes[index];
          NavigationEvents.emit('selectedTabPressed', route);
          // console.log('5555');
        }

        onComplete();
      },
    },
  }
)

export default MainTabNavigator;

// class MainTabNavigatorWithState extends React.PureComponent{
//   static propTypes = {
//     dispatch: PropTypes.func.isRequired,
//     nav: PropTypes.object.isRequired,
//   };
  
//   render() {
//     const { dispatch, nav } = this.props;
//     return (
//       <MainTabNavigator
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

// export default connect(mapStateToProps)(MainTabNavigatorWithState);