// import { configureStore } from "@reduxjs/toolkit";
// import rootReducer from './combineReducers'
// import createSagaMiddleware from 'redux-saga'
// import groupsSaga from "./redux-saga/group_saga";

// const sagaMiddleware = createSagaMiddleware();


// const store = configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware().concat(sagaMiddleware),
// });
// sagaMiddleware.run(groupsSaga)

// export default store;


import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './combineReducers';
import groupsSaga from './redux-saga/group_saga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(groupsSaga);

export default store;
