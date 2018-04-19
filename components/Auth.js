import React from 'react';
import {
  View, Text
} from 'react-native';
import { Button } from 'react-native-elements';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateUser } from '../reducers/user'; 

import voters from '../voters';

const AuthScreenView = styled.View`
  flex: 1;
  justify-content: center;
  align-self: center;
`;

const VoterButton = styled(Button)`
  
`;

class AuthScreen extends React.PureComponent{
  _onSelectVoter = ({ userName, address, privateKey }) => {
    const {updateUser, _onAuthenticated} = this.props;
    const _privateKey = Buffer.from(privateKey, 'hex');
    updateUser({ userName, address, privateKey: _privateKey });
    _onAuthenticated();
  }

  _renderVoterButtons = () => (
    voters.map(voter=> (
      <VoterButton
        key={voter.address}
        title={voter.userName}
        borderRadius={15}
        backgroundColor='#6495ED'
        buttonStyle={{
          width: 250,
          marginBottom: 20
        }}
        onPress={() => this._onSelectVoter(voter)}
      />
    ))
  )
  
  render(){
    return(
      <AuthScreenView>
        {this._renderVoterButtons()}
      </AuthScreenView>
    );
  }
}

const mapDispatchToProps = dispatch => 
  bindActionCreators({updateUser}, dispatch)

export default connect(null, mapDispatchToProps)(AuthScreen);