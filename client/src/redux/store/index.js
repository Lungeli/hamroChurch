import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage';
import users from '../reducerSlice/users'
import logger from 'redux-logger'
import { persistReducer, persistStore } from 'redux-persist';

        const persistConfig = {
        key: 'root',
        storage,
      }

        const reducer = combineReducers({
       users,
        //..
        })


        const persistedReducer = persistReducer(persistConfig, reducer)     
        export const store = configureStore({
        reducer:persistedReducer,
        middleware: [logger]
})

        export const persistor = persistStore(store)

// export default store;