import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  Picker
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';

class ProfileScreen extends React.PureComponent {

  render(){
    const { address, userName } = this.props;
    return(
      <View style={styles.container}>
        <Text> {userName} </Text>
        <Text> {address} </Text>
        <QRCode
          value={address}
          size={150}
        />
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
  questionInput:{
    borderWidth: 1,
    height: 40,
    width: 250
  }
});

const mapStateToProps = ({user}) => {
  const { address, userName } = user;
  return { address, userName }
};

// const mapDispatchToProps = dispatch => bindActionCreators(

// );

export default connect(mapStateToProps)(ProfileScreen);