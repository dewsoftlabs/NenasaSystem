// shopReducer.js
const initialState = {
  shopname: '',
  image: '',
  address: '',
  email: '',
  facebook: '',
  instagram: '',
  logo: '',
  website: '',
  whatsapp: ''
};

const shopReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SHOP_DETAILS':
      return {
        ...state,
        ...action.payload // Spread the payload to update multiple fields
      };
    default:
      return state;
  }
};

export default shopReducer;
