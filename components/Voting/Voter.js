import React from 'react';
import {
  View, Text, StyleSheet, Modal
} from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateVoteHistory } from '../../reducers/history';
import styled from 'styled-components';
import StepIndicator from 'react-native-step-indicator';
import BarGraph from '../Common/BarGraph';
import getWeb3 from '../../utils/getWeb3';
import Contract from '../../utils/Contract';

const ModalView = styled.View`
  flex-direction: column;
  flex: 1;
`;

const StepView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StepText = styled.Text`
  font-family: 'Montserrat-Medium';
  color: #777;
  font-size: 18;
  margin-bottom: 15;
`

const StepIndicatorView = styled(StepIndicator)`

`;

const ResultViewDetail = styled(View)`
  flex:1;
  align-items: center;
`;

const DoneButton = styled(Button)`

`;

const STEPS = ['Register', 'Vote', 'Result'];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fe7013',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#fe7013',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#fe7013'
}

const web3 = getWeb3();

class VoterScreen extends React.Component{
  constructor(props){
    super(props);
    const contractInstance = new web3.eth.Contract(this.props.contractAbi);
    this.state = {
      contractInstance,
      currentStep: 0,
      // isRegistering: false,
      isRegisterStep: false,
      isVoteStep: false,
      isResultStep: false,
      isRegistered: false, // is passed register step or not
      totalRegistered: 0,
      totalEligible: 0,
      isVoting: false,
      vote: '',
      isStartingComputeTally: false,
      isVoted: false, // is passed vote step or not
      isSubmitedVote: false,
      isFinish: false
    }
  }

  async componentDidUpdate(){
    const {
      isRegistering,
      contractAddress,
      address,
      privateKey
    } = this.props;

    const {
      question,
      totalEligible,
      totalRegistered,
      isRegistered,
      isVoted,
      isStartingComputeTally,
      contractInstance,
      // isRegisterStep,
      // isVoteStep,
      // isResultStep
    } = this.state;

    if(isRegistering && !contractInstance.options.address){
      contractInstance.options.address = contractAddress;
    }

    // Listen for voter registration
    if(!isRegistered){    
      if(!question || !totalEligible || !totalRegistered){
        const [ question, totalEligible, totalRegistered ] = await Promise.all([
          Contract.call(address, '', contractAddress, 'question'),
          Contract.call(address, '', contractAddress, 'totalEligible'),
          Contract.call(address, '', contractAddress, 'totalRegistered'),
        ]);
        this.setState({
          question,
          totalEligible: Number(totalEligible),
        })
      }
      
      contractInstance.once('VoterRegistered',{}, (err, res)=>{
        if(!err){
          const {returnValues:{_totalRegistered}} = res;
          this.setState({
            totalRegistered: Number(_totalRegistered),
          });
        }else{
          console.log(err);
        }
      });

      contractInstance.once('StartVote', {}, (err, res) => {
        if(err){
          console.log(err);
        }else{
          this.setState({
            // isRegisterStep: false,
            // isVoteStep: true,
            isRegistered: true,
            // isVoting: true
          })
        }
      });
    }

    // Listen for voter voting
    if(isRegistered && !isVoted){
      contractInstance.once('VoterVoted',{},(err,res)=>{
        if(!err){
          const {returnValues:{_totalVoted}} = res;
          const totalVoted = Number(_totalVoted);
          this.setState({
            totalVoted,
            isVoted: (totalVoted === totalRegistered),
            isStartingComputeTally: true
          });
        }else{
          console.log(err);
        }
      })
    }


    if(isRegistered && isVoted){
      try{
        const result = await Contract.call(address, privateKey, contractAddress, 'computeTally');
        console.log(result);
        const { question, updateVoteHistory } = this.props;
        this.setState({
          isStartingComputeTally: false,
          result: [Number(result[0]), Number(result[1])],
          // isFinish: true
        });
        // Save to history
        updateVoteHistory(contractAddress, question, result);
      }catch(error){
        console.log(error)
      }
    }
  }

  // Step1
  _renderRegistrationStep = () => {

    const {
      totalRegistered,
      totalEligible,
      question
    } = this.state;
    
    const {
      isRegistering, 
    } = this.props;

    return(
      <StepView>
        <StepText> Question: {question} </StepText>
        { !isRegistering ? (
          <View>
            <StepText> [+] You have already registerd </StepText>
            <StepText> Total Registred: {totalRegistered}/{totalEligible} </StepText>
          </View>
        ):(
          <StepText> [+] Registering ... </StepText>
        )}
      </StepView>
    )
  }

  // Step 2
  _onVote = async (vote) => {
    await this.setState({ isSubmitedVote: true });
    const { contractAddress, address, privateKey } = this.props;
    const { _success, _message } = await Contract.call(address, privateKey, contractAddress, 'submitVote',[web3.utils.toHex(vote)]);
    if(_success){
      this.setState({ isVoted: true });
    } else {
      console.log('Vote failed');
      console.log(_message);
    }
  }

  _renderVoteStep = () => {
    const { isSubmitedVote, question} = this.state;
    return (
      <StepView>
        {/* <Text>VoteId: {this.props.contractAddress}</Text> */}
        <StepText> Question: {question} </StepText>
        {
          isSubmitedVote ? (
            <StepText> You have submited your vote. </StepText>
          ):(
            <View>
              <Button
                onPress={() => this._onVote('yes')}
                title='Yes'
                borderRadius={15}
                buttonStyle={{
                  marginTop: 15,
                  width: 250,
                  backgroundColor: '#4F80E1'
                }}
              />
              <Button
                onPress={() => this._onVote('no')}
                title='No'
                borderRadius={15}
                buttonStyle={{
                  marginTop: 15,
                  width: 250,
                  backgroundColor: '#4F80E1'
                }}
              />
            </View>
          )
        }
        
      </StepView>
    );
  }
  

  // Step 3
  _onFinishVoting = () => {
    this.setState({ isFinish: true });
  }

  _renderResultStep = () => {
    const {
      question,
      isStartingComputeTally,
      totalRegistered,
      result
    } = this.state;
    return(
      <StepView>
        {isStartingComputeTally ? (
          <StepText>Computing tally .... </StepText>
        ):(
          <ResultViewDetail>
            <StepText> Question: {question} </StepText>
            <StepText> Total Voters: {totalRegistered} </StepText>
            <BarGraph result={result} />
            <DoneButton
              title='Done'
              onPress={this.props._onFinishVoting}
              borderRadius={15}
              buttonStyle={{
                backgroundColor: '#4F80E1'
              }}
            />
          </ResultViewDetail>  
        )}
      </StepView>
    )
  }

  _renderStep = (currentStep) => {
    switch (currentStep) {
      case 0:
        return this._renderRegistrationStep()
      case 1:
        return this._renderVoteStep()
      case 2:
        return this._renderResultStep()
      default:
        return(
          <Text>And again, how did u come here ??</Text>
        )
    }
  }

  render(){
    const {
      isRegistered,
      isVoted,
      isFinish
    } = this.state;

    const {
      // isVoteFinish,
      isVoting,
      isRegistering
    } = this.props;

    const currentStep = isRegistered + isVoted;
    
    return(
      <Modal 
        onRequestClose={()=>{}}
        transparent={false}
        visible={ isVoting }
      >
        <ModalView>
          <StepIndicatorView
            customStyles={customStyles}
            currentPosition={currentStep}
            labels={STEPS}
            stepCount={STEPS.length}
          />

          {this._renderStep(currentStep)}
        </ModalView>
      </Modal>
    )
  }
}

const mapStateToProps = ({ contract, user }) => {
  const { contractAbi, contractAddress } = contract;
  const { address, privateKey } = user;
  return { contractAbi, contractAddress, address, privateKey }
} 

const mapDispatchToProps = dispatch => 
  bindActionCreators({ updateVoteHistory }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(VoterScreen);