import React from 'react';
import {
  View, Text, StyleSheet, Button
} from 'react-native';
import { createSwitchNavigator } from 'react-navigation';

class VotingRoomScreen extends React.PureComponent{

  state = {
    question: '',
    vote: 0,
    contractAddr: '',
    abi: [{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
  }

  onVote = (vote) => e => {
    this.setState({vote},()=>{
      console.log(this.state.vote);
    });
  }

  render(){
    return(
      <View>
        <Text>VoteId: {this.props.voteId}</Text>
        <Text> Question: {this.state.question} </Text>
        <Button
          style={styles.button}
          onPress={this.onVote(1)}
          title="Yes"
        />
        <Button
          style={styles.button}
          onPress={this.onVote(0)}
          title="No"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    width: 200,
  },
});

export default VotingRoomScreen;