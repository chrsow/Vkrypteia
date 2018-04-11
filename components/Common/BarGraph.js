import React from 'react';
import { View, Text } from 'react-native';
import { BarChart, XAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import styled from 'styled-components';

const BarGraph = styled.View`
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

export default (props = [0,0]) => {
  const { result } = props;
  return(
    <BarGraph>
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
    </BarGraph>
  );
}