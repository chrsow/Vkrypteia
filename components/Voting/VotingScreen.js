import React from 'react';
import { View, Modal, Text, Alert } from 'react-native';
import { 
  FormLabel, FormInput, FormValidationMessage, Divider, Button, Icon
} from 'react-native-elements';
import QRCodeScreen from '../Common/QRCodeScreen';
import VotingModalScreen from './VotingModalScreen';
import VoterScreen from './Voter';
// import QRCode from 'react-native-qrcode-svg';
import styled from 'styled-components';
import Contract from '../../utils/Contract';
import { isAddress } from '../../utils/helpers';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateContract } from '../../reducers/contract';

const VotingView = styled.View`
  flex: 1;
  flex-direction: column;
  /* margin-bottom: 15; */
`;

const VotingHeaderView = styled.View`
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #4F80E1;
`

const VotingHeaderText = styled.Text`
  font-family: 'Montserrat-SemiBold';
  font-size: 25;
  color: white;
  font-weight: bold;
`;

const QuestionFormLabel = styled(FormLabel)`
  margin-top: 150;
`;

const VoterAddField = styled(View)`
  flex-direction: row;
  margin-bottom: 10;
  justify-content: space-between;
`;

const VoterFormLabel = styled(FormLabel)`

`

const VoterList = styled(View)`
  /* flex: 1; */
`;

const VoterDetail = styled(View)`
  flex-direction: row;
  justify-content: space-around;
`;

const VoterAddressText = styled.Text`
  justify-content: center;
  align-items: center;
  font-size: 13;
`;

const AddVoterButton = styled(Button)`
  /* margin-right: 50; */
`;

const RemoverVoterIcon = styled(Icon)`

`;

const NewVoteButton = styled(Button)`
  background-color: #4F80E1;
`

const ScanVoteButton = styled(Button)`
  background-color: #4F80E1;
`;

const DividerLine = styled(Divider)`
  height: 1;
  background-color: #C0C0C0;
  margin: 15px 0px 15px 0px;
  align-self: center;
  width: 325;
`;


class VotingCreationScreen extends React.Component{
  state = {
    // ***** For Creating Vote *****
    isCreateVote: false,
    question: '',
    voters: [],
    isCreating: false,
    isAddingVoter: false,
    // For alert warning
    isDuplicateVoter: false,
    isInvalidAddress: false,
    isEmptyQuestion: false,
    isEmptyVoter: false,
    // For voting creation (contract deploy)
    isDeployContractSuccess: false,
    isBeginSignupSuccess: false,

    // ***** For Vote *****
    isSearchingVote: false,
    isRegistering: false,
    isVoting: false,
    isVoteFinish: false
  }

  _onQuestionChange = (question) => {
    this.setState({question});
  }

  _onAddVoter = (voter) => {
    this.setState({ isAddingVoter: true });
  }

  // Cancel QR Code scan
  _onPressCancelModal = () => {
    this.setState({ isAddingVoter: false });
  }
  
  // On success QRcode scan 
  _onSelectVoter = (voter) => {
    if(!isAddress(voter)){
      this.setState({ isInvalidAddress: true });
    } else {
      let { voters } = this.state;
      // In case we already add the voter
      if(voters.findIndex(v => v === voter) >= 0) {
        this.setState({ isDuplicateVoter: true, isAddingVoter: false });
      } else {
        this.setState({
          voters: [...voters, voter],
          isAddingVoter: false
        });
      }
    }
  }

  _onCreateVoting = () => {
    const { question, voters } = this.state;
    // Empty question
    if(!question) {
      this.setState({ isEmptyQuestion: true });
    } else if(!voters.length){ // Empty Voters
      this.setState({ isEmptyVoter: true })
    } else {
      this._onVoting(question, voters);
    }
  }

  _onVoting = (question, voters) => {
    const { address, privateKey } = this.props;
    // Oh man..., callback hell
    this.setState({isCreating: true}, async ()=>{
      let contractAddress = await Contract.deploy(address, privateKey);
      if(contractAddress){
        console.log('contractAddress: ' + contractAddress);
        this.props.updateContract(contractAddress);
        this.setState({ isDeployContractSuccess: true }, async()=>{
          let beginSetupSuccess = await Contract.call(address, privateKey, contractAddress,'beginSignup',[question, 1200, 1200, voters]);
          const { _success, _error } = beginSetupSuccess;
          console.log("beginSignup success?" + _success);
          if(_success){
            this.setState({ isBeginSignupSuccess: true });
          }else{
            // error message
            this.setState({isCreating: false});
          }
        });
      } else {
        this.setState({isCreating: false});
        this._alertFaiedDeployContract();
      }
    });
  }

  _onFinishCreateVoting = () => {
    this.setState({isCreating: false});
  }
  
  _onRemoveVoter = (voterAddress) => {
    let newVoters = this.state.voters.filter(v => v !== voterAddress);
    this.setState({
      voters: newVoters
    })
  }
  
  // ***** For Voter  *****

  // For vote Scan saerching
  _onSearchingVote = () => {
    this.setState({isSearchingVote: true});
  }

  // When voter scan qr code for voting
  _onScanVote = async (contractAddress) => {
    const { updateContract, address, privateKey } = this.props;
    updateContract(contractAddress);
    this.setState({
      isSearchingVote: false,
      isRegistering: true
    });
    const {_success, _message} = await Contract.call(address, privateKey, contractAddress, 'register');
    if(!_success){
      console.log(_message);
    } else {
      console.log('Register success')
      this.setState({isRegistering: false, isVoting: true});
    }
  }

  // voter cancel for searching vote room
  _onCancelSearchingVote = () => {
    this.setState({isSearchingVote: false});
  }

  // When vote finish
  _onFinishVote = () => {
    this.setState({isVoting: false, isVoteFinish: true});
  }

  _alertEmptyQuestion = () => {
    const onStopEmptyQuestionWarning = () => this.setState({ isEmptyQuestion: false })
    Alert.alert(
      'Empty Question',
      'Question must not be blanked.',
      [
        {text: 'Go Back',onPress: onStopEmptyQuestionWarning}
      ]
    );
  }

  _alertEmptyVoter = () => {
    const onStopEmptyVoterWarning = () => this.setState({ isEmptyVoter: false })
    Alert.alert(
      'Empty Voter',
      'The vote must has at least 1 Voter.',
      [
        {text: 'Go Back',onPress: onStopEmptyVoterWarning}
      ]
    );
  }

  _alertSetDuplicateVoter = ()=> {
    const onStopDuplicateWarning = () => this.setState({ isDuplicateVoter: false })
    Alert.alert(
      'Duplicate voter',
      'Already added this voter.',
      [
        {text: 'Go Back',onPress: onStopDuplicateWarning}
      ]
    );
  }

  _alertInvalidAddress = () => {
    const onStopInvalidAddressWarning = () => 
      this.setState({ isInvalidAddress: false, isAddingVoter: false })
    Alert.alert(
      'Invalide address',
      'The value is not a valid Ethereum address.',
      [
        {text: 'Go Back',onPress: onStopInvalidAddressWarning }
      ]
    );
  }

  _alertFaiedDeployContract = () => {
    Alert.alert(
      'Deployed Failed',
      'Something wrong on deploying contract.',
      [
        {text: 'Go Back',onPress: ()=>{} }
      ]
    );
  }

  _renderVoterList = () => (
    <VoterList>
      {
      this.state.voters.map( voterAddress => (
        <VoterDetail key={voterAddress}>
          <VoterAddressText> {voterAddress} </VoterAddressText>
          <RemoverVoterIcon
            onPress={() => this._onRemoveVoter(voterAddress)}
            name='indeterminate-check-box'
          />
        </VoterDetail>  
      ))
    }
    </VoterList>
  )

  // _renderVoteModal = () => {
  //   const { 
  //     question, isCreating, isDeployContractSuccess, isBeginSignupSuccess 
  //   } = this.state;
  //   const { contractAddress } = this.props.contract;
  //   return(
      
  //   );
  // }

  _renderAlerts = () => {
    const { 
      isDuplicateVoter, isEmptyQuestion, isInvalidAddress, isEmptyVoter
    } = this.state;

    return(
      <View>
        {/* Warning on set the same voter */}
        { isDuplicateVoter && this._alertSetDuplicateVoter() }

        {/* Warning on set the same voter */}
        { isEmptyQuestion && this._alertEmptyQuestion() }

        {/* Warning on invalid voter address */}
        { isInvalidAddress && this._alertInvalidAddress() }

        {/* Warning on empty voter */}
        { isEmptyVoter && this._alertEmptyVoter() }
      </View>
    );
  }

  render(){
    const { 
      // For Create Vote
      isSearchingVote, 
      isAddingVoter,
      question, 
      isCreating, 
      isDeployContractSuccess,
      isBeginSignupSuccess, 
      voters,
      // For vote
      isRegistering,
      isVoting,
      isVoteFinish
    } = this.state;

    const { contractAddress } = this.props.contract;

    const votingModalScreenProps = {
      question, 
      isCreating,
      isDeployContractSuccess, 
      isBeginSignupSuccess,
      contractAddress,
      totalEligible: voters.length,
      _onFinishCreateVoting: this._onFinishCreateVoting
    };

    const voterScrenProps = {
      isRegistering,
      isVoting,
      isVoteFinish,
      _onFinishVote: this._onFinishVote,
      contractAddress
    }

    return(
        <VotingView>
          <VotingHeaderView>
            <Icon 
              color='white' name='hand' 
              type='entypo' size={62}               
              />
            <VotingHeaderText> Voting </VotingHeaderText>
          </VotingHeaderView>
          {/* VOTE CREATION */}
          <QuestionFormLabel>Question</QuestionFormLabel>
          <FormInput onChangeText={this._onQuestionChange}/>
          <VoterAddField>
            <VoterFormLabel>Voters</VoterFormLabel>
            <AddVoterButton
              onPress={this._onAddVoter}
              title='Add Voter'
              backgroundColor='#6495ED'
              borderRadius={15}
            />
          </VoterAddField>
          {this._renderVoterList()}
          <NewVoteButton 
            // raised
            icon={{name:'add-circle'}}
            onPress={this._onCreateVoting}
            title='New Vote'
            backgroundColor='#4F80E1'
            borderRadius={15}
            titleStyle={{
              fontFamilty: 'Montserrat-Semibold'
            }}
            buttonStyle={{
              alignSelf: 'center',
              width: 300,
            }}
          />      
          {/* Modal */}
          {/* { this._renderVoteModal() } */}
          <VotingModalScreen {...votingModalScreenProps} />

          {/* Alert Warning */}
          { this._renderAlerts() }

          {/* QR Code scanner */}
          { isAddingVoter && 
            <QRCodeScreen 
            _onPressCancelModal={this._onPressCancelModal} 
            _onReadQrCode={this._onSelectVoter}
            />
          }

          <DividerLine/>

          {/* VOTE SCAN */}
          { isSearchingVote &&
            <QRCodeScreen
              _onPressCancelModal={this._onCancelSearchingVote} 
              _onReadQrCode={this._onScanVote}
            />
          }
          <VoterScreen {...voterScrenProps} />
          <ScanVoteButton
            // icon={{name:'add-circle-outline', buttonStyle: styles.button}}
            icon={{name:'add-circle-outline'}}
            onPress={this._onSearchingVote}
            title='Scan for Vote'
            backgroundColor='rgba(78, 116, 289, 1)'
            borderRadius={15}
            buttonStyle={{
              // height: 75
              alignSelf: 'center',
              width: 300
            }}
          />         
        </VotingView>
      )
  }
}

const mapStateToProps = ({contract, user}) => {
  const { privateKey, address } = user;
  return {contract, privateKey, address}
}

const mapDispatchToProps = dispatch => 
  bindActionCreators({updateContract}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(VotingCreationScreen);