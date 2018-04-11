import React from 'react';
import {
  View, Text, TextInput, Button, StyleSheet
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

class CreateVoteScreen extends React.PureComponent{
  state = {
    txHash: ''  
  }

  render(){
    const { txHash } = this.state;
    return(
      <View>
        <QRCode
          value={txHash}
        />
      </View>
    );
  }
}

export default CreateVoteScreen;