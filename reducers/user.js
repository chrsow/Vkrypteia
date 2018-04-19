import { VOTER1_ADDRESS, VOTER1_PRIVATEKEY } from 'react-native-dotenv';

const UPDATE_USER = 'vkrypteia/user/UPDATE_USER';

// const initialState = {
//   userName: 'Voter1',
//   address: VOTER1_ADDRESS ,
//   privateKey: VOTER1_PRIVATEKEY
// }

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case UPDATE_USER:
      return action.payload
    default: return state;
  }
}

export const updateUser = (voter) => ({
  type: UPDATE_USER,
  payload: voter
})