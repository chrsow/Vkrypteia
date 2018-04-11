import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { CheckBox, List, ListItem } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { Button } from 'react-native-elements';

import QRCodeScreen from '../Common/QRCodeScreen';
import VotingHistoryDetail from './VotingHistoryDetail';

class ScanHistoryScreen extends React.PureComponent{
  _onScanVotingHistory = () => {

  }

  _onPressVoteDetail = () => {
    const { navigate } = this.props.navigation;
    navigate('VotingHistoryDetail',{
      
    })
  }

  _renderScanVotingHistory = () => (
    <List containerStyle={{marginBottom: 20}}>
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
      <View style={styles.container}>
        <Button 
          raised
          icon={{name: 'add'}}
          title='Add New Vote History'
          onPress={this._onScanVotingHistory}
        />
        {this._renderScanVotingHistory()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center'
  }
});

const mapStateToProps = ({}) => {

}

const ScanHistoryStack = StackNavigator({
  ScanHistoryScreen: {
    screen: ScanHistoryScreen,
    // title: 'Eeiei'
  },
  VotingHistoryDetail: { screen: VotingHistoryDetail }
});

export default ScanHistoryStack;
