import React from 'react';
import { View, ScrollView, Text, Alert } from 'react-native';
import { BarChart, XAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import styled from 'styled-components';
import QRCode from 'react-native-qrcode-svg';
import { map } from 'd3-collection';

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


const ResultView = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15;
`;

const VoteIdView = styled.View`
  flex-direction: row;
`;

const VoteIdText = styled.Text`
  font-size: 15;
  font-weight: bold;
`;

const VoteIdValueText = styled.Text`
  font-size: 15;
`;

const QuestionView = styled.View`
  margin-top: 15;
  flex-direction: row;
`;

const QuestionText = styled.Text`
  font-size: 15;
  font-weight: bold;
`;

const QuestionValueText = styled.Text`

`;

const BarChartView = styled(BarChart)`
  flex: 1;
  margin-top: 10; 
`;

const ResultTextView = styled.View`
  flex-direction: row;
  margin-top: 15;
`;

const ResultText = styled.Text`
  
`;

const ResultValueText = styled.Text`

`;

const QRCodeView = styled(QRCode)`
  margin-top: 10;
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
    const { contractAddress, question, result } = this.props.navigation.state.params;
    return(
      <ScrollView style={{width: '100%'}}>
        <ResultView>
          <VoteIdView>
            <VoteIdText> VoteId:  </VoteIdText>
            <VoteIdValueText> {contractAddress} </VoteIdValueText>
          </VoteIdView>
          <QuestionView>
            <QuestionText> Question:</QuestionText>
            <QuestionValueText>  {question} </QuestionValueText>
          </QuestionView>
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
          <ResultTextView>
            <ResultText> Result: </ResultText>
            <ResultValueText> Yes: {result[0]}  No: {result[1]}  </ResultValueText>
          </ResultTextView>
          <QRCodeView
            value={contractAddress}
          />
        </ResultView>
      </ScrollView>
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
