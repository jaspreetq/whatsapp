import { configureStore } from '@reduxjs/toolkit'
import RootReducer from '../Reducer/RootReducer'

// import rootReducer from './reducers'

export const Store = configureStore({ reducer: RootReducer })
// The store now has redux-thunk added and the Redux DevTools Extension is turned on