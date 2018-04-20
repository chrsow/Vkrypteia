const UPDATE_CONTRACT_ADDRESS = 'vkrypteia/contract/UPDATE_CONTRACT_ADDRESS';

const initialState = {
  contractAddress: '',
  contractAbi: [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"eligible","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"addressId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"computeTally","outputs":[{"name":"_tally","type":"uint8[2]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"register","outputs":[{"name":"_success","type":"bool"},{"name":"_message","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_vote","type":"bytes"}],"name":"submitVote","outputs":[{"name":"_success","type":"bool"},{"name":"_message","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalEligible","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"endSignupPhase","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"question","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"endRegistration","outputs":[{"name":"_success","type":"bool"},{"name":"_message","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalRegistered","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"endVotingPhase","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getMyMoneyBack","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"registered","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalVoted","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"voters","outputs":[{"name":"addr","type":"address"},{"name":"registered","type":"bool"},{"name":"voteCasted","type":"bool"},{"name":"vote","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"addresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_question","type":"string"},{"name":"_signupTime","type":"uint256"},{"name":"_votingTime","type":"uint256"},{"name":"_addresses","type":"address[]"}],"name":"beginSignup","outputs":[{"name":"_success","type":"bool"},{"name":"_message","type":"bytes"}],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_message","type":"string"},{"indexed":false,"name":"_success","type":"bool"}],"name":"BeginSignup","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_totalRegistered","type":"uint256"}],"name":"VoterRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_totalVoted","type":"uint256"}],"name":"VoterVoted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_message","type":"string"}],"name":"FinishVote","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_message","type":"string"}],"name":"tallyComputed","type":"event"}]
}

export default reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    
    case UPDATE_CONTRACT_ADDRESS:
      return {...state, contractAddress: action.payload}
    default: return state;
  }
}

export const updateContract = contractAddress => ({
  type: UPDATE_CONTRACT_ADDRESS,
  payload: contractAddress
})