import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  Picker
} from 'react-native';
import {
  ADMIN_ADDRESS,
  ADMIN_PRIVATEKEY,
  VOTER1_ADDRESS,
  VOTER1_PRIVATEKEY,
  VOTER2_ADDRESS,
  VOTER2_PRIVATEKEY,
  VOTER3_ADDRESS,
  VOTER3_PRIVATEKEY,
} from 'react-native-dotenv';

// import "../global";
// import getWeb3 from '../utils/getWeb3';
// const web3 = getWeb3();
// import Tx from 'ethereumjs-tx';

class AdminScreen extends React.PureComponent {
  state = {
    // adminAddr: ADMIN_ADDRESS,
    // adminPriv: Buffer.from(ADMIN_PRIVATEKEY, 'hex'),
    // question: '',
    // submitQuestion: false,
    // voters: [],
    // contractAddr: '0xf156d7e8f5fa0da07c4cb390b2db809a60f98b11',
    // abi: [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"addressId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"register","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"submitVote","outputs":[{"name":"_success","type":"bool"},{"name":"_message","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"endSignupPhase","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"receivedEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"question","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address[]"}],"name":"setEligible","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"gap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalRegistered","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"sendEtherToVoter","outputs":[{"name":"_success","type":"bool"},{"name":"_error","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_question","type":"string"},{"name":"_signupTime","type":"uint256"},{"name":"_votingTime","type":"uint256"}],"name":"beginSignup","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"endVotingPhase","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalVoted","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"suicide","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"addresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"msg","type":"string"}],"name":"FinishSignup","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"msg","type":"string"}],"name":"FinishVote","type":"event"}]

  }

  onQuestionChange = (question) => {
    // let question = e.target.value;
    this.setState({question},()=>{
      console.log(this.state.question);
    });
  }

  onSelectVoter = (v, i)=>{
    this.setState({voters: [v]},()=>{
      console.log(this.state.voters);
    });
  }

  onAdminSetupVoting = () => {
    // this.setState({submitQuestion: true});
    // const {question, adminAddr, adminPriv, abi, contractAddr} = this.state;
    // const contractInstance = new web3.eth.Contract(abi, contractAddr, {from: adminAddr});
    // // let data = contractInstance.methods.beginSignup("23424",100,100);
    // let data = contractInstance.methods.owner;
    // const rawTx = {
    //   gasPrice: web3.eth.gasPrice, 
    //   gasLimit: '0x270100',
    //   to: contractAddr, 
    //   from: adminAddr,
    //   gas: 2000000,
    //   chainId: 4,
    //   data
    // }
    // let tx = new Tx(rawTx);
    // tx.sign(adminPriv);

    // let serializedTx = tx.serialize();
    
    // web3.eth.sendSignedTransaction(serializedTx.toString('hex'))
    //   .on('receipt', console.log);
  }

  render(){
    return(
      <View style={styles.container}>
        <Text> Admin Create Vote </Text>
        {
          this.state.submitQuestion ?
          ( 
            <View>
              <Text>Question: {this.state.question}</Text>
              <Text>Eligible Voters: {this.state.voters[0]}</Text>
            </View>
          ):(
            <View>
              <TextInput
                style={styles.questionInput}
                onChangeText={this.onQuestionChange}
              />
              <Picker
                onValueChange={this.onSelectVoter}  
              >
                <Picker.Item label="Voter0" value={VOTER1_ADDRESS}/>
                <Picker.Item label="Voter1" value={VOTER1_ADDRESS}/>
              </Picker>
              <Button 
                onPress={this.onAdminSetupVoting}
                title="Submit Voting"
              />
            </View>
          )
        }
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionInput:{
    borderWidth: 1,
    height: 40,
    width: 250
  }
  
});

export default AdminScreen;