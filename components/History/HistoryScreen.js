import React from 'react';
import {
  View, Text, StyleSheet
} from 'react-native';
// import { createBottomTabNavigator } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';

import QRCodeScreen from '../Common/QRCodeScreen';
import VotingHistoryScreen from './VotingHistoryScreen';
import ScanHistoryScreen from './ScanHistoryScreen';

import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateScanVoteHistory } from '../../reducers/history'

const HistoryScreenView = styled(View)`
  flex: 1;
  flex-direction: column;
`;

const HistoryHeaderView = styled(View)`
  justify-content: center;
  align-items: center;
  background-color: #B46486;
  /* height: 200; */
  padding: 15px;
`;

const HeaderText = styled(Text)`
  color: white;
  font-size: 22;
  font-weight: bold;
  margin-top: 10;
`

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
    headerMode: 'screen',
    tabBarOptions:{
      tabStyle: {
        height: 50,    
      },
      title: 'none',
      labelStyle: {
        fontSize: 12,
      },
      indicatorStyle: {
        backgroundColor: 'white'
      },
    
      activeTintColor: 'white',
      style: {
        backgroundColor: '#4F80E1',
      },
    },
    tabBarPosition: 'top',
    navigationOptions: {
      header: { visible: false },

    }
    
  }
)

const HistoryTabsView = styled(HistoryTabs)`
  flex: 1;
`

class HistoryScreen extends React.PureComponent{
  render(){
    const {history, updateScanVoteHistory} = this.props;
    return(
      <HistoryScreenView>
        <HistoryHeaderView>
          <Icon color='white' name='list' type='fontawesome' size={62} />
          <HeaderText> History </HeaderText>
        </HistoryHeaderView>
        <HistoryTabsView
          screenProps={{
            history, 
            actions: {updateScanVoteHistory}
          }}
        />
      </HistoryScreenView>
    )
  }
}

const mapStateToProps = ({history}) => ({history})
const mapDispatchToProps = dispacth => 
  bindActionCreators({updateScanVoteHistory}, dispacth)
  
export default connect(mapStateToProps, mapDispatchToProps)(HistoryScreen);