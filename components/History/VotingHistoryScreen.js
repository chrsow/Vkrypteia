import React from 'react';
import {Text, View, ListView} from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';
import styled from 'styled-components';

import VotingHistoryDetail from './VotingHistoryDetail';

const VotingHistoryView = styled.ScrollView`  
  flex: 1;
`;
class VotingHistoryScreen extends React.PureComponent{  
  _onPressVoteDetail = (contractAddress, question, result) => {
    const { navigate } = this.props.navigation;
    navigate('VotingHistoryDetail',{
      contractAddress, question, result
    })
  }

  _renderVotingHistory = () => (
    <List>
    {
      this.props.screenProps.history.voteHistory.map((vote, index)=>{
        const {contractAddress, question, result} = vote;
        return(
          <ListItem
            roundAvatar
            avatar={{}}
            key={index}
            title={question}
            subtitle={contractAddress}
            rightTitle={(result[0] > result[1]) ? 'Yes' : 'No'}
            rightTitleStyle={{color: 'green'}}
            onPress={() => this._onPressVoteDetail(contractAddress, question, result)}
          />
        )
      })
    }
    </List>
  )
  

  render(){
    return(
      <VotingHistoryView>
        { this._renderVotingHistory() }
      </VotingHistoryView>
    )
  }
}

const VotingHistoryStack = StackNavigator(
  {
    VotingHistory: {
      screen: VotingHistoryScreen,
      // headerStyle: {
      //   width: 50
      // }
    },
    VotingHistoryDetail: {
      screen: VotingHistoryDetail,
      navigationOptions: {
        headerTitle: 'Result',
        showLabel: false
      }
    }
  },{
    
    // mode: 'modal',
    // headerMode: 'none'
  }
);

export default VotingHistoryStack;