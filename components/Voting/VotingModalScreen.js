import React from 'react';
import { View, Text, Modal } from 'react-native';
import styled from 'styled-components';
import StepIndicator from 'react-native-step-indicator';
import { ViewPager } from 'rn-viewpager';
import QRCode from 'react-native-qrcode-svg';
import BarGraph from '../Common/BarGraph';
import { Button, Icon } from 'react-native-elements';
import getWeb3 from '../../utils/getWeb3';
import Contract from '../../utils/Contract';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateVoteHistory } from '../../reducers/history';

// ModalView for voting creation
const ModalView = styled(View)`
  /* margin-top: 22; */
  flex-direction: column;
  flex: 1;
  /* justify-content: center; */
  /* align-items: center; */
  /* width: 100%; */
`;

const ResultViewDetail = styled(View)`
  flex:1;
  align-items: center;
`;

const StepIndicatorView = styled(StepIndicator)`
  /* margin-vertical: 50; */
`;

const ViewPagerView = styled(ViewPager)`
  flex-grow: 1;
`;

const StepView = styled(View)`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const STEPS = ['Setup', 'Registration' , 'Voting', 'Vote Result'];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#4F80E1', //'#fe7013',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#4F80E1',//'#fe7013',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#4F80E1',//'#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#4F80E1',//'#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#4F80E1',//'#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#4F80E1',//'#fe7013'
}

// const MyFont = Expo.Font.style('Montserrat-Light');
const StepText = styled.Text`
  /* font-family: MyFont; */
`

// Step1
const DeployText = styled.Text`

`

const SignupText = styled.Text`

`

// Step2


const web3 = getWeb3();

class VotingModalScreen extends React.Component {
  constructor(props){
    super(props);
    const contractInstance = new web3.eth.Contract(this.props.contractAbi);
    this.state = {
      totalEligible: 1, //0
      totalRegistered: 0, //0
      totalVoted: 0, //0
      isRegistrationSuccess: false,
      isStartingVoting: false,
      isVotingSuccess: false,
      isStartingComputeTally: false,
      isFinish: false,
      result: [0,0],
      currentStep: 0, //for step indicator,
      contractInstance
    }
  }

  // For better Perf.
  // shouldComponentUpdate(nextProps){
  //   return(
  //     nextProps.isCreating !== this.props.isCreating ||
  //     nextProps.isDeployContractSuccess !== this.props.isDeployContractSuccess ||
  //     nextProps.isBeginSignupSuccess !== this.props.isBeginSignupSuccess ||
  //     nextProps.contractAddress !== this.props.contractAddress
  //   );
  // }
  

  async componentDidUpdate(prevProps){
    const {
      isRegistrationSuccess, isVotingSuccess, isFinish
      , totalRegistered, totalEligible
    } = this.state;

    const {isBeginSignupSuccess, contractAddress} = this.props;

    // Only Set once when no one register
    if(isBeginSignupSuccess && !totalRegistered){
      this.state.contractInstance.options.address = contractAddress;
    }
    
    // Listen for voter registration
    if(isBeginSignupSuccess && !isRegistrationSuccess){
      this.state.contractInstance.once('VoterRegistered',{}, (err, res)=>{
        if(!err){
          const {returnValues:{_totalRegistered}} = res;
          console.log('_totalRegistered: ' + _totalRegistered);
          _totalRegistered = Number(_totalRegistered);
          this.setState({
            totalRegistered: _totalRegistered,
            // isRegistrationSuccess: (_totalRegistered === totalEligible)
          });
        }else{
          console.log(err);
        }
      });
    }

    // Listen for voter voting
    if(isRegistrationSuccess && !isVotingSuccess){
      this.state.contractInstance.once('VoterVoted',{},(err,res)=>{
        if(!err){
          const {returnValues:{_totalVoted}} = res;
          _totalVoted = Number(_totalVoted);
          this.setState({
            totalVoted: _totalVoted,
            isVotingSuccess: (_totalVoted === totalRegistered),
            isStartingComputeTally: true
          });
        }else{
          console.log(err);
        }
      })
    }

    // Compute tally
    if(isVotingSuccess && !isFinish){
      try{
        const result = await Contract.call(contractAddress, 'computeTally');
        const {question, updateVoteHistory} = this.props;
        this.setState({
          isStartingComputeTally: false,
          result: [Number(result[0]), Number(result[1])],
          isFinish: true
        });
        // Save to history
        updateVoteHistory(contractAddress, question, result);
      }catch(error){
        console.log(error)
      }
    }
  }

  // Step 1
  _renderSetupStep = () => {
    return (
      <StepView>
        { this.props.isDeployContractSuccess ? (
          <View>
            <StepText> [+] 1/1 Deploy Contract Sucess </StepText>
          </View>
        ):(
          // Some Loader here
          <View>
            <Icon name='loading' type='material-community-icons' size={12}/>
            <StepText> [-] 0/1 Deploying Contract</StepText>
          </View>
        )}

        { this.state.isBeginSignupSuccess ? (
          <View>
            <Text> [+] 1/1 Begin Signup Sucess </Text>
          </View>
        ):(
          <View>
            <Text> [-] 0/1 Beginning setup Regrastration </Text>
          </View>
        )}
      </StepView>
    )
  }

  // Step 2
  _onStopRegistration = async () => {
    const {totalRegistered} = this.state;
    if (!totalRegistered){
      Alert.alert(
        'No eligible voter.',
        'At least 1 eligible voter.',
        [
          {text: 'Go Back'}
        ]
      );
    }else{
      try {      
        this.setState({isStartingVoting: true});
        const {_success, _message} = await Contract.call(this.props.contractAddress, 'endRegistration');
        console.log(_success)
        console.log(_message)
        if(_success){
          this.setState({
            isStartingVoting: false, 
            isRegistrationSuccess: _success
          });
        }else{
          console.log(_message);
        }
      } catch (error) {
        console.log(error);
      }  
    }
  }

  _renderRegistrationStep = () => {
    const {isRegistrationSuccess, isStartingVoting, totalRegistered} = this.state;
    const {totalEligible} = this.props;
    // if( totalEligible === totalRegistered )
    return(
      <StepView>
        { isRegistrationSuccess ? (
          <View>
            {/* TODO: registration time left */}
            <Text> [+] Registration Success </Text>
          </View>
        ):(
          <View>
            <QRCode 
              value={this.props.contractAddress}
            />
            <Text> Total Registered: {totalRegistered}/{totalEligible} </Text>
            {
              isStartingVoting ? (
                <Text>Starting....</Text>
              ):(
                <Button
                  title='Start Vote'
                  onPress={this._onStopRegistration}
                />
              )}
          </View>          
        )}
      </StepView>
    )
  }

  // // Step 3
  _renderVotingStep = () => (
    <StepView>
      { this.state.isVotingSuccess ? (
          <View>
            <Text> [+] Voting success </Text>
          </View> 
        ):(
          <View>
            <Text> Total Vote: {this.state.totalVoted}/{this.state.totalRegistered} </Text>
          </View> 
        )
      }
    </StepView> 
  )

  // Step 4
  _renderVoteResultStep = () => {
    const {isStartingComputeTally} = this.state;
    return(
      <StepView>
        {isStartingComputeTally ? (
          <Text>Computing tally .... </Text>
        ):(
          <ResultViewDetail>
            <Text> Question: {this.props.question} </Text>
            <Text> Total Voters: {this.state.totalRegistered} </Text>
            <BarGraph result={this.state.result} />
            <Button
              title='Done'
              onPress={this.props._onFinishVoting}
            />
          </ResultViewDetail>  
        )}
      </StepView>
    )
  }

  _renderStep = (currentStep) => {
    // const { isDeployContractSuccess, isBeginSignupSuccess } = this.props;
    // const { isRegistrationSuccess, isVotingSuccess } = this.state;

    // const currentStep = isDeployContractSuccess + isBeginSignupSuccess 
    //   + isRegistrationSuccess + isVotingSuccess;
    switch (currentStep) {
      // case 0:
      //   return this._renderDeployContractStep()
      // case 1:
      //   return this._renderRegistrationSetupStep()
      
      case 0:
        return this._renderSetupStep()
      case 1:
        return this._renderRegistrationStep()
      case 2:
        return this._renderVotingStep()
      case 3:
        return this._renderVoteResultStep()
      default:
        return(
          <View><Text> gg, how u come here ?? </Text></View>
        )
    }
  }

  // _changeStep = () => {
  //   const { isDeployContractSuccess, isBeginSignupSuccess } = this.props;
  //   const { isRegistrationSuccess, isVotingSuccess } = this.state;
    
  //   setTimeout(() => {
  //     this.setState({ currentStep })
  //   }, 2000);
  // }

  render(){
    const {
      question, isCreating, isDeployContractSuccess,
      isBeginSignupSuccess, contractAddress, voters
    } = this.props;

    const {
      isRegistrationSuccess, isVotingSuccess
    } = this.state;

    const currentStep =  isBeginSignupSuccess 
      + isRegistrationSuccess + isVotingSuccess;
  
    return(
      <Modal 
        onRequestClose={()=>{}}
        transparent={false}
        visible={ isCreating }
      >
        <ModalView>
          <StepIndicatorView
            customStyles={customStyles}
            currentPosition={currentStep}
            labels={STEPS}
            stepCount={STEPS.length}
          />
          
          { this._renderStep(currentStep) }
        </ModalView>
      </Modal>
    )
  }
}

const mapStateToProps = ({contract}) => ({contractAbi: contract.contractAbi})
const mapDispatchToProps = dispatch => 
  bindActionCreators({updateVoteHistory}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(VotingModalScreen);