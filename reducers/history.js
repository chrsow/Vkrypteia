// const LOAD   = 'vkrypteia/user/LOAD';
// const CREATE = 'vkrypteia/user/CREATE';
// const UPDATE = 'vkrypteia/user/UPDATE';
// const REMOVE = 'vkrypteia/user/REMOVE';
const UPDATE_VOTE_HISTORY = 'vkrypteia/history/UPDATE_VOTE_HISTORY';

const initialState = {
  scanHistory: [],
  voteHistory: [{
    // avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    contractAddress: '0x1231234235',
    question: 'Dog > Cat ?',
    result: [14, 10]
  }]
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    // do reducer stuff
    case UPDATE_VOTE_HISTORY:
      const {scanHistory, voteHistory} = state;
      return {scanHistory, voteHistory: [...voteHistory, action.payload]}
    default: return state;
  }
}

export const updateVoteHistory = (contractAddress, question, result) => ({
  type: UPDATE_VOTE_HISTORY,
  payload: {contractAddress, question, result}
})