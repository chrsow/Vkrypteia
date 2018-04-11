import React from 'react';
import {
  View,
  Text,
  StyleSheet, TextInput
} from 'react-native';
// import { Button } from 'react-native-elements';
import Button from '../Common/Button';
import { Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import styled from 'styled-components';

// import "../global";
// import Tx from 'ethereumjs-tx';
// import getWeb3 from '../utils/getWeb3';
// const web3 = getWeb3();

import {
  VOTER1_ADDRESS,
  VOTER1_PRIVATEKEY,
} from 'react-native-dotenv';

import CreateVoteScreen from './CreateVoteScreen';
import VotingCreationScreen from './VotingCreationScreen';
import QRCodeScreen from '../Common/QRCodeScreen';
import QRCodeButton from '../Common/QRCodeButton';

const DividerLine = styled(Divider)`
  height: 1;
  background-color: #e1e8ee;
`;

const VotingView = styled(View)`
  flex: 1;
  justify-content: center;
`;

class VotingScreen extends React.PureComponent{
  static navigationOptions = {
    tabBarLebel: 'Vote',
  };

  constructor(props){
    super(props);
    this.state = {
      // dataSource: new ListView.DataSource({
      //   rowHasChanged: () => false,
      //   sectionHeaderHasChanged: () => false,
      // }),
      voteId: '',
      isSelectVoteId: false,
      isScanningQRCode: false
    }
  }

  componentDidMount(){
    // let dataSource = this.state.dataSource.cloneWithRowsAndSections({

    // });  
  }

  _onPressNewVote = () => {
    
  }

  _onPressQRCodeScanVoteId = () => {
    this.setState({isScanningQRCode: true});
  }

  _onSelectVoteId = (voteId) => {
    this.setState({voteId, isSelectVoteId: true});
  }

  _onPressCancelModal = () => {
    this.setState({isScanningQRCode: false});
    // this.props.navigation.dismissModal();
  };

  render(){
    const {isSelectVoteId, isScanningQRCode, voteId} = this.state;
    
    return(
      <View style={styles.container}>
      {
        isSelectVoteId ? (
          <View voteId={voteId}/>
          // <VotingCreationScreen voteId={voteId}/>
      ):(
        <View>
        {
          isScanningQRCode ? (
            <QRCodeScreen 
            _onPressCancelModal={this._onPressCancelModal} 
            _onReadQrCode={this._onSelectVoteId}/>
        ):(
          <VotingView>
            {/* <TextInput
              style={styles.voteIdInput}
              onChangeText={this._onPressQRCodeScanVoteId}
            /> */}
            {/* <QRCodeButton/> */}
            <VotingCreationScreen/>
            <DividerLine/>
            <Button 
              raised
              // icon={{name:'add-circle-outline', buttonStyle: styles.button}}
              icon={{name:'add-circle-outline'}}
              onPress={this._onPressQRCodeScanVoteId}
              title='Scan for Vote'
              backgroundColor='blue'
              // borderRadius={styles.button.borderRadius}
            />          
          </VotingView>
        )}
        </View>
      )}
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
  voteIdInput:{
    borderWidth: 1,
    height: 40,
    width: 250
  },
  // button:{
  //   padding: 150,
  //   borderRadius: 50
  // }
});

export default VotingScreen;
// export default connect()(VotingScreen);