import React from 'react';
import {
  View, Text, StyleSheet, Button
} from 'react-native';
// import { createSwitchNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Button from '../Common/Button';
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

class VoterScreen extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = {
      currentStep: 0,
      isRegistering: false,
      isRegistered: false,
      totalRegisterd: 0,
      totalEligible: 0,
      isVoting: false,
      vote: '',
    }
  }

  componentDidUpdate(){
    console.log(this.props);
  }

  // Step1
  _renderRegistrationStep = () => {
    const {
      isRegistering, isRegistered, totalRegisterd, totalEligible
    } = this.state;
    return(
      <StepView>
        { isRegistering ? (
          <View>
            <Text> Total Registred: {totalRegisterd}/{totalEligible} </Text>
            { isRegistered && <Text> You have already registerd </Text> }
          </View>
        ):(
          // <View>

          // </View> 
          <Text> [+] Ready to vote </Text>
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
  _renderResultStep = () => (
    <StepView>
    </StepView>
  )

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

    return(
      <View>
        <StepIndicatorView
          customStyles={customStyles}
          currentPosition={currentStep}
          labels={STEPS}
        />

        {this._renderStep(currentStep)}

      </View>
    )
  }
}
const mapStateToProps = ({contract:{contractAbi, contractAddress}}) => ({
  contractAbi, contractAddress
})

export default connect(mapStateToProps)(VoterScreen);