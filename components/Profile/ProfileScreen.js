import React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Picker
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';

import Icon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components';


const ProfileScreenView = styled.View`
  flex: 1;
  flex-direction: column;
`

const HeaderView = styled.View`
  flex-direction: column;
  padding: 25px;
  background-color: #292C44;
  justify-content: center;
  align-items: center;
`

const HeaderText = styled(Text)`
  color: white;
  font-size: 22;
  font-weight: bold;
  margin-top: 10;
`

const ProfileView = styled.View`
  /* justify-content: space-between; */
  align-items: center;
`

const UserNameText = styled.Text`
  font-size: 25;
  margin-top: 20;
  margin-bottom: 15;
`

const AddressText = styled.Text`
  font-size: 15;
  margin-bottom: 15;
`

class ProfileScreen extends React.PureComponent {

  render(){
    const { address, userName } = this.props;
    return(
      <ProfileScreenView>
        <HeaderView>
          <Icon color='white' name='face' size={62} />
          <HeaderText> Profile </HeaderText>
        </HeaderView>
        <ProfileView>
          <UserNameText> {userName} </UserNameText>
          <AddressText> {address} </AddressText>
          <QRCode
            value={address}
            size={150}
          />
        </ProfileView>
      </ProfileScreenView>
    );
  }
}

const mapStateToProps = ({user}) => {
  const { address, userName } = user;
  return { address, userName }
};

// const mapDispatchToProps = dispatch => bindActionCreators(

// );

export default connect(mapStateToProps)(ProfileScreen);