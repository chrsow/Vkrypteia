import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { CheckBox, List, ListItem } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { Button } from 'react-native-elements';
import QRCodeScreen from '../Common/QRCodeScreen';
import VotingHistoryDetail from './VotingHistoryDetail';
import styled from 'styled-components';
import Contract from '../../utils/Contract';

const ScanHistoryView = styled.View`

`

class ScanHistoryScreen extends React.PureComponent{
  constructor(props){
    super(props);
    const {scanHistory} = this.props.screenProps.history;
    this.state = {
      scanHistory,
      isScanningVoteHistory: false,
      isLoadingVoteHistory: false
    }
  }

  _onScanVoteHistory = async (contractAddress) => {
    this.setState({isScanningVoteHistory: false, isLoadingVoteHistory: true});
    const [question, result] = await Promise.all(
      [Contract.call(contractAddress, 'question'), Contract.call(contractAddress, 'computeTally')]
    )
    const _result = [Number(result[0]), Number(result[1])];
    this.props.screenProps.actions.updateScanVoteHistory(contractAddress, question, _result)
    this.setState({isLoadingVoteHistory: question === ''})
  }

  _onPressCancelModal = () => this.setState({isScanningVoteHistory: false})

  _onPressVoteDetail = (contractAddress, question, result) => {
    const { navigate } = this.props.navigation;
    navigate('ScanVotingHistoryDetail',{
      contractAddress, question, result
    })
  }

  _renderScanVotingHistory = () => (
    <List>
    {
      // this.props.voteHistory.map(()=>(
      this.state.scanHistory.map((vote, index)=>{
        const {contractAddress, question, result} = vote;
        return(
          <ListItem
            roundAvatar
            // avatar={{uri:vote.avatar_url}}
            key={index}
            title={question}
            subtitle={contractAddress}
            onPress={() => this._onPressVoteDetail(contractAddress, question, result)}
          />
        )
      })
    }
    </List>
  )


  render(){
    const {isScanningVoteHistory, isLoadingVoteHistory} = this.state;
    return(
      <ScanHistoryView>
        <Button 
          raised
          icon={{name: 'add'}}
          title='Add New Vote History'
          onPress={()=> this.setState({isScanningVoteHistory: true})}
        />
        {isLoadingVoteHistory && <Text> Loading ... </Text>}
        {this._renderScanVotingHistory()}
        {
          isScanningVoteHistory && 
          <QRCodeScreen
            _onPressCancelModal={this._onPressCancelModal} 
            _onReadQrCode={this._onScanVoteHistory}
          />
        }
      </ScanHistoryView>
    )
  }
}

const ScanHistoryStack = StackNavigator({
  ScanHistoryScreen: {
    screen: ScanHistoryScreen,
    // title: 'Eeiei'
  },
  ScanVotingHistoryDetail: { screen: VotingHistoryDetail }
});

export default ScanHistoryStack;
