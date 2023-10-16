// shopReducer.js
const initialState = {
  userid: null,
  fullname: null,
  address: null,
  email: null,
  gender: null,
  userroleid: null,
  phonenumber: null,
  username: null,
  profileimage: null,
  website: null,
  whatsapp: null
};

const permissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_PERMISSION_DETAILS':
      return {
        ...state,
        ...action.payload // Spread the payload to update multiple fields
      };
    default:
      return state;
  }
};

export default permissionReducer;
