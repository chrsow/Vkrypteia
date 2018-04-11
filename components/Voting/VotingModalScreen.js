import React from 'react';
import { View, Text, Modal } from 'react-native';
import styled from 'styled-components';
import StepIndicator from 'react-native-step-indicator';
import { ViewPager } from 'rn-viewpager';
import QRCode from 'react-native-qrcode-svg';
import BarGraph from '../Common/BarGraph';

// ModalView for voting creation
const ModalView = styled(View)`
  margin-top: 22;
  flex: 1;
  /* justify-content: center; */
  align-items: center;
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

const PageView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const PAGES = ['Deploy Contract', 'Registration Setup', 'Registration' , 'Voting', 'Vote Result'];
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



export default class VotingModalScreen extends React.PureComponent {
  state = {
    totalEligible: 1, //0
    totalRegistered: 1, //0
    totalVoted: 1, //0
    isRegistrationSuccess: false,
    isVotingSuccess: false,
    result: [0,0],
    currentStep: 0 //for step indicator
  }

  _onVote = () => {

  }

  _renderRegistrationView = () => (
    <View>
      <Text> Total Registered: {this.state.totalEligible}/{this.state.totalRegistered} </Text>
    </View>
  )
  

  _renderResultView = () => (
    <ResultViewDetail>
      <BarGraph result={this.state.result} />
    </ResultViewDetail>
  )
  
  // // Step1
  _renderDeployContractStep = () => (
    <PageView>
      { this.props.isDeployContractSuccess ? (
        <View>
          <Text> [+] Deploy Contract Sucess </Text>
        </View>
      ):(
        // Some Loader here
        <View><Text> Deploying Contract</Text></View>
      )}
    </PageView>
  )

  // // Step 2
  _renderRegistrationSetupStep = () => (
    <PageView>
      { this.state.isBeginSignupSuccess ? (
        <View>
          <Text> [+] Begin Signup Sucess </Text>
        </View>
      ):(
        <View>
          <Text> Beginnig setup Regrastration </Text>
        </View>
      )}
    </PageView>
  )

  // // Step 3
  _renderRegistrationStep = () => (
    <PageView>
      { this.state.isRegistrationSuccess ? (
        <View>
          {/* TODO: registration time left */}
          <Text> [+] Registration Success </Text>
        </View>
      ):(
        <View>
          <QRCode 
            value={this.props.contractAddress}
          />
          <Text> Total Registered: {this.state.totalRegistered}/{this.state.totalEligible} </Text>
        </View>          
      )}
    </PageView>
  )

  // // Step 4
  _renderVotingStep = () => (
    <PageView>
      { this.state.isVotingSuccess ? (
          <View>
            <Text> [+] Voting success </Text>
          </View> 
        ):(
          <View>
            <Text> Total Votecasted: {this.state.totalVoted}/{this.state.totalEligible} </Text>
          </View> 
        )
      }
    </PageView> 
  )

  // Step 5
  _renderVoteResultStep = () => (
    <PageView>
      <ResultViewDetail>
        <Text> Question: {this.props.question} </Text>
        <Text> Total Voters: {this.state.totalEligible} </Text>
        <BarGraph result={this.state.result} />
      </ResultViewDetail>
    </PageView>
  )

  _renderStep = (currentStep) => {
    // const { isDeployContractSuccess, isBeginSignupSuccess } = this.props;
    // const { isRegistrationSuccess, isVotingSuccess } = this.state;

    // const currentStep = isDeployContractSuccess + isBeginSignupSuccess 
    //   + isRegistrationSuccess + isVotingSuccess;

    switch (currentStep) {
      case 0:
        return this._renderDeployContractStep()
      case 1:
        return this._renderRegistrationSetupStep()
      case 2:
        return this._renderRegistrationStep()
      case 3:
        return this._renderVotingStep()
      case 4:
        return this._renderResultView()
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

    const currentStep = isDeployContractSuccess + isBeginSignupSuccess 
      + isRegistrationSuccess + isVotingSuccess;
  
    // return(
    //   <Modal 
    //     onRequestClose={()=>{}}
    //     transparent={false}
    //     visible={ isCreating }
    //   >
    //     <ModalView>
    //       <StepIndicatorView
    //         customStyles={customStyles}
    //         currentPosition={this.state.currentPosition}
    //         labels={labels}
    //       />
    //       <View>
    //         <Text>Question: {question}</Text>

    //         { isDeployContractSuccess ? (
    //           <View>
    //             <Text> 1/2 Deploy Contract Sucess </Text>
    //           </View>
    //         ):(
    //           // Some Loader here
    //           <View><Text> Deploying Contract</Text></View>
    //         )}

    //         { isBeginSignupSuccess ? (
    //           <View>
    //             <Text> 2/2 Begin Signup Sucess </Text> 
    //             <QRCode 
    //               value={contractAddress}
    //             />
    //           </View>
    //         ):(
    //           // Some Loader here
    //           <View/>
    //         )}
          
    //       {/* Registration */}
    //       {
    //         isDeployContractSuccess && isBeginSignupSuccess &&
    //         this._renderRegistrationView()
    //       }

    //       {/* Result of vote */}
    //       {
    //         isDeployContractSuccess && isBeginSignupSuccess &&
    //         isRegistrationSuccess &&
    //         this._renderResultView()
    //       }

    //       </View>
    //     </ModalView>
    //   </Modal>
    // );
    return(
      <Modal 
        onRequestClose={()=>{}}
        transparent={false}
        visible={ isCreating }
      >
        {/* <ModalView> */}
          <StepIndicatorView
            customStyles={customStyles}
            currentPosition={currentStep}
            labels={PAGES}
          />
          
          { this._renderStep(currentStep) }
        {/* </ModalView> */}
      </Modal>
    )
  }
}