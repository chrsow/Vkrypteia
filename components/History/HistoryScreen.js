import React from 'react';
import {
  View, Text, StyleSheet
} from 'react-native';
// import { createBottomTabNavigator } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { TabNavigator } from 'react-navigation';

import QRCodeScreen from '../Common/QRCodeScreen';
import VotingHistoryScreen from './VotingHistoryScreen';
import ScanHistoryScreen from './ScanHistoryScreen';

const HistoryTabs = TabNavigator(
  {
    History: {
      screen: VotingHistoryScreen,
      // path: 'voter-history'
    },
    Scan: {
      screen: ScanHistoryScreen ,
      // path: 'scan-history'
    }
  },{
    
    initialRouteName: 'History',
    // activeTintColor: '#F44336',
    tabBarOptions:{

    },
    tabBarPosition: 'top'
  }
);

export default HistoryTabs;