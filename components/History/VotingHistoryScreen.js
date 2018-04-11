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
  _onPressVoteDetail = () => {
    const { navigate } = this.props.navigation;
    navigate('VotingHistoryDetail',{
      
    })
  }

  _renderVotingHistory = () => (
    <List>
    {
      // this.props.voteHistory.map(()=>(
      [{title:'sadf',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',

      }].map((vote, index)=>(
        <ListItem
          roundAvatar
          avatar={{uri:vote.avatar_url}}
          key={index}
          title={vote.name}
          subtitle={vote.subtitle}
          onPress={this._onPressVoteDetail}
        />
      ))
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

// class VotingHistoryScreen extends React.PureComponent{
//   render(){
//     return(
//       <VotingHistoryStack navigation={addNavigationHelpers({
//         dispatch: this.props.dispatch,
//         state: this.props.navigation ,
//       })} />
//     );
//   }
// }

const VotingHistoryStack = StackNavigator({
  VotingHistory: {
    screen: VotingHistoryScreen,
    // title: 'History'
  },
  VotingHistoryDetail: {
    screen: VotingHistoryDetail,
    title: 'Detail'
  }
});

// const mapStateToProps = ({history}) => {
//   // const mapStateToProps = (state) => {
//     const {voteHistory} = history;
//     return {voteHistory};
//   }

  // connect(mapStateToProps)(
// export default VotingHistoryScreen;
export default VotingHistoryStack;