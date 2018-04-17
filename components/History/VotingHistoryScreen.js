import React from 'react';
import {Text, View, ListView} from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';
import styled from 'styled-components';

import VotingHistoryDetail from './VotingHistoryDetail';

const VotingHistoryView = styled.View`
  /* justify-content: center; */
`;
class VotingHistoryScreen extends React.PureComponent{
  constructor(props){
    super(props);
    const { voteHistory } = this.props.screenProps.history;
    this.state = {
      voteHistory
    }
  }
  _onPressVoteDetail = (contractAddress, question, result) => {
    const { navigate } = this.props.navigation;
    navigate('VotingHistoryDetail',{
      contractAddress, question, result
    })
  }

  _renderVotingHistory = () => (
    <List>
    {
      // this.props.voteHistory.map(()=>(
      this.state.voteHistory.map((vote, index)=>{
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

const VotingHistoryStack = StackNavigator({
  VotingHistory: {
    screen: VotingHistoryScreen,
    // title: 'History'
  },
  VotingHistoryDetail: {
    screen: VotingHistoryDetail,
    // title: 'Detail'
    navigationOptions: {
      // headerTitle: 'Result',
      showLabel: false
    }
  }
});

export default VotingHistoryStack;