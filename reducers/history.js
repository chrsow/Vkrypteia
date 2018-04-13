// const LOAD   = 'vkrypteia/user/LOAD';
// const CREATE = 'vkrypteia/user/CREATE';
// const UPDATE = 'vkrypteia/user/UPDATE';
// const REMOVE = 'vkrypteia/user/REMOVE';

const initialState = [
  {
    scanHistory: {},
    voteHistory: [{
      name: 'Chris Jackson',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      subtitle: 'Vice Chairman',
      address: '0x555555555'
    }]
  }

];

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    // do reducer stuff
    default: return state;
  }
}

// export function 