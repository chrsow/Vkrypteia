const UPDATE_VOTE_HISTORY = 'vkrypteia/history/UPDATE_VOTE_HISTORY';
const UPDATE_SCAN_VOTE_HISTORY = 'vkrypteia/history/UPDATE_SCAN_VOTE_HISTORY';

const initialState = {
  scanHistory: [],
  voteHistory: []
  // [{
  //   contractAddress: '0x1231234235',
  //   question: 'Dog > Cat ?',
  //   result: [14, 10]
  // },{
  //   contractAddress: '0x1231234235',
  //   question: 'Windows > Mac OS ?',
  //   result: [0, 5]
  // }]
}

export default function reducer(state = initialState, action = {}) {
  const {scanHistory, voteHistory} = state;
  switch (action.type) {
    // do reducer stuff
    case UPDATE_VOTE_HISTORY:
      return {scanHistory, voteHistory: [action.payload, ...voteHistory]}
    case UPDATE_SCAN_VOTE_HISTORY:
      return {voteHistory, scanHistory: [action.payload, ...scanHistory]}
    default: return state;
  }
}

export const updateVoteHistory = (contractAddress, question, result) => ({
  type: UPDATE_VOTE_HISTORY,
  payload: {contractAddress, question, result: [Number(result[0]), Number(result[1])]}
})

export const updateScanVoteHistory = (contractAddress, question, result) => ({
  type: UPDATE_SCAN_VOTE_HISTORY,
  payload: {contractAddress, question, result: [Number(result[0]), Number(result[1])]}
})