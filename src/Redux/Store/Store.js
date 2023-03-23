import {configureStore} from '@reduxjs/toolkit'
import rootReducer from './rootReducer';
import ContactsSaga from './ContactsSaga'
import createSagaMiddleware from 'redux-saga';

// const store = createStore(rootReducer);
const sagaMiddleware = createSagaMiddleware();
const store  = configureStore({
    reducer:rootReducer,
    middleware:()=>[sagaMiddleware]
});

sagaMiddleware.run(ContactsSaga);

export default store;