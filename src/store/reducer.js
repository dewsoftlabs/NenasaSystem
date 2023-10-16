import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customization/customizationReducer';
import shop from './shop/shopReducer';
import user from './user/userReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  shop: shop,
  user: user
});

export default reducer;
