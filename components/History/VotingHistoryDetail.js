import React from 'react';
import { View, Text, Alert } from 'react-native';
import { BarChart, XAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import styled from 'styled-components';
import QRCode from 'react-native-qrcode-svg';

const VotingHistoryDetailView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const BarGraphView = styled.View`
  height: 250;
  width: 200;
  /* padding: 20; */
`;

const BarChartView = styled(BarChart)`
  flex: 1;
`;

const ResultView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const QRCodeView = styled(QRCode)`
  margin-top: 100;
`;

class VotingHistoryDetail extends React.PureComponent{
  state = {
    isVoteFinish: true
  }

  _renderAlert = () => {
    Alert.alert(
      'Vote is not done yet.',
      'Please come back again when vote is done.',
      [
        {text: 'Go Back',onPress: () => this.props.navigation.goBack()}
      ]
    );
  }

  _renderResult = () => {
    const result = [ 14, 10];

    const {voteId, question, address} = this.props;
    return(
      <ResultView>
        <Text> VoteId: {voteId} </Text>
        <Text> Question: {question} </Text>
        <BarGraphView>
          <BarChartView
            // style={{ flex: 1 }}
            data={result}
            gridMin={0}
            svg={{ fill: 'rgb(134, 65, 244)' }}
          />        
          <XAxis
            style={{ marginTop: 10 }}
            data={result}
            scale={scale.scaleBand}
            formatLabel={ (value,index) => (index ? 'No' : 'Yes') }
            labelStyle={ { color: 'black' } }
          />
        </BarGraphView>
        <Text> Result: </Text>
        <Text> Yes: {result[0]}  </Text>
        <Text> No: {result[1]}  </Text>
        <QRCodeView
          value={address}
        />
      </ResultView>
    );
  }
  render(){
    return(
      <VotingHistoryDetailView>
        { this.state.isVoteFinish ? this._renderResult() : this._renderAlert()}
      </VotingHistoryDetailView>
    );
  }
}

export default VotingHistoryDetail;
