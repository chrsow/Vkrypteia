import { VOTER1_ADDRESS, VOTER1_PRIVATEKEY } from 'react-native-dotenv';

// const LOAD   = 'vkrypteia/user/LOAD';
// const CREATE = 'vkrypteia/user/CREATE';
// const UPDATE = 'vkrypteia/user/UPDATE';
// const REMOVE = 'vkrypteia/user/REMOVE';

const initialState = {
  userName: 'Voter1',
  address: VOTER1_ADDRESS ,
  privateKey: VOTER1_PRIVATEKEY
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    // do reducer stuff
    default: return state;
  }
}