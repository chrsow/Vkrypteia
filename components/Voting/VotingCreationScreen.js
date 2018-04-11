import React from 'react';
import { View, Modal, Text, Alert } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Icon } from 'react-native-elements';
import Button from '../Common/Button';
import QRCodeScreen from '../Common/QRCodeScreen';
import VotingModalScreen from './VotingModalScreen';
// import QRCode from 'react-native-qrcode-svg';
import styled from 'styled-components';
import Contract from '../../utils/Contract';
import { isAddress } from '../../utils/helpers';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateContract } from '../../reducers/contract';

const VoterAddField = styled(View)`
  flex-direction: row;
`;

const VoterList = styled(View)`

`;

const VoterDetail = styled(View)`
  flex-direction: row;
`;

const AddVoterButton = styled(Button)`
  margin-left: 200;
`;

const RemoverVoterIcon = styled(Icon)`

`;

class VotingCreationScreen extends React.PureComponent{
  state = {
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
    isBeginSignupSuccess: false
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
      // Oh man..., callback hell
      this.setState({isCreating: true}, async ()=>{
        let contractAddress = await Contract.deploy();
        if(contractAddress){
          console.log(contractAddress);
          this.props.updateContract(contractAddress);
          this.setState({ isDeployContractSuccess: true }, async()=>{
            let beginSetupSuccess = await Contract.call(contractAddress,'beginSignup',[question, 500000, voters]);
            console.log("beginSignup success?" + beginSetupSuccess);
            // let voters = await Contract.call(contractAddress, 'addresses');
            const { _success, _message } = beginSetupSuccess;
            if(_success){
              this.setState({ isBeginSignupSuccess: true });
            }else{
              // error message
              // Alert.alert _message
              this.setState({ isCreating: false });
            }
          });
        } else {
          // Alert
          this.setState({ isCreating: false });
        }
      });
    }
  }

  _onRemoveVoter = (voterAddress) => {
    let newVoters = this.state.voters.filter(v => v !== voterAddress);
    this.setState({
      voters: newVoters
    })
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

  

  _renderVoterList = () => (
    <VoterList>
      {
      this.state.voters.map( voterAddress => (
        <VoterDetail key={voterAddress}>
          <Text> {voterAddress} </Text>
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
      isAddingVoter,question, isCreating, isDeployContractSuccess,
      isBeginSignupSuccess } = this.state;

    const { contractAddress } = this.props.contract;

    const votingModalScreenProps = {
      question, isCreating, isDeployContractSuccess, 
      isBeginSignupSuccess, contractAddress
    };
    return(
      <View>
        
        <FormLabel>Question</FormLabel>
        <FormInput onChangeText={this._onQuestionChange}/>
        <VoterAddField>
          <FormLabel>Voters</FormLabel>
          <AddVoterButton
            onPress={this._onAddVoter}
            title='Add Voter'
          />
        </VoterAddField>
        {this._renderVoterList()}
        <Button 
          raised
          icon={{name:'add-circle'}}
          onPress={this._onCreateVoting}
          title='New Vote'
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

      </View>
    );
  }
}

const mapStateToProps = ({contract}) => ({contract})


const mapDispatchToProps = dispatch => 
  bindActionCreators({updateContract}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(VotingCreationScreen);