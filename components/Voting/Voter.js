import React from 'react';
import {
  View, Text, StyleSheet, Button, Modal
} from 'react-native';
// import { createSwitchNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import styled from 'styled-components';
import StepIndicator from 'react-native-step-indicator';
import getWeb3 from '../../utils/getWeb3';
import Contract from '../../utils/Contract';

const StepView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StepIndicatorView = styled(StepIndicator)`

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
      isRegistered: false,
      totalRegisterd: 0,
      totalEligible: 0,
      isVoting: false,
      vote: '',
      isStartingComputeTally: false,
      isVotingSuccess: false
    }
  }

  async componentDidUpdate(){
    // const {isRegistering, isVoting, isVoteFinish, _onFinishVote} = this.props;

    const {
      isRegistering,
      contractAddress
    } = this.props;

    const {
      isRegistered,
      isStartingComputeTally,
      contractInstance
    } = this.state;

    if(isRegistering && !contractInstance.options.address){
      this.state.contractInstance.options.address = contractAddress;
    }

    // Listen for voter registration
    if(isRegistering){
      contractInstance.once('VoterRegistered',{}, (err, res)=>{
        if(!err){
          const {returnValues:{_totalRegistered}} = res;
          console.log('_totalRegistered: ' + _totalRegistered);
          _totalRegistered = Number(_totalRegistered);
          this.setState({
            totalRegistered: _totalRegistered,
          });
        }else{
          console.log(err);
        }
      });
    }

    // Listen for voter voting
    if(isRegistered && !isVotingSuccess){
      // contractInstance.once('VoterVoted',{},(err,res)=>{
      //   if(!err){
      //     const {returnValues:{_totalVoted}} = res;
      //     _totalVoted = Number(_totalVoted);
      //     this.setState({
      //       totalVoted: _totalVoted,
      //       isVotingSuccess: (_totalVoted === totalRegistered),
      //       isStartingComputeTally: true
      //     });
      //   }else{
      //     console.log(err);
      //   }
      // })
    }
  }

  // Step1
  _renderRegistrationStep = () => {
    // const {
    //   isRegistering, isRegistered, totalRegisterd, totalEligible
    // } = this.state;

    const {
      isRegistered
    } = this.state;
    
    const {
      isRegistering, totalEligible, totalRegisterd
    } = this.props;

    return(
      <StepView>
        { !isRegistering ? (
          <View>
            <Text> Total Registred: {totalRegisterd}/{totalEligible} </Text>
            { isRegistered && <Text> You have already registerd </Text> }
          </View>
        ):(
          <Text> [+] Registering ... </Text>
        )}
      </StepView>
    )
  }

  // Step 2
  _onVote = (vote) => e => this.setState({vote})

  _renderVoteStep = () => (
    <StepView>
      <Text>VoteId: {this.props.contractAddress}</Text>
      <Text> Question: {this.state.question} </Text>
      <Button
        onPress={this._onVote('Yes')}
        title='Yes'
      />
      <Button
        onPress={this._onVote('No')}
        title='No'
      />
    </StepView>
  )

  // Step 3
  _renderResultStep = () => {
    const {isStartingComputeTally} = this.state;
    return(
      <StepView>
        {isStartingComputeTally ? (
          <StepText>Computing tally .... </StepText>
        ):(
          <ResultViewDetail>
            <StepText> Question: {this.props.question} </StepText>
            <StepText> Total Voters: {this.state.totalRegistered} </StepText>
            <BarGraph result={this.state.result} />
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
    const {currentStep} = this.state;
    const {isRegistering, isVoting, isVoteFinish} = this.props;

    return(
      <Modal 
        onRequestClose={()=>{}}
        transparent={false}
        visible={ isRegistering || isVoting }
      >
        <View>
          <StepIndicatorView
            customStyles={customStyles}
            currentPosition={currentStep}
            labels={STEPS}
            stepCount={STEPS.length}
          />

          {this._renderStep(currentStep)}
        </View>
      </Modal>
    )
  }
}

const mapStateToProps = ({contract}) => ({contractAbi: contract.contractAbi})

export default connect(mapStateToProps)(VoterScreen);