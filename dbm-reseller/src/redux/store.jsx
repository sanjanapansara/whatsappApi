import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/reducer.user'
import SettingReducer from './reducers/reducer.setting'
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from './reducers/reducer.app';

const persistedReducerUser = persistReducer(
  {
    key: "auth",
    storage,
  },
  userReducer,
);


const persistedReducerApp = persistReducer(
  {
    key: "app",
    storage,
  },
  appReducer,
);

const persistedReducerSetting = persistReducer(
  {
    key: "setting",
    storage,
  },
  SettingReducer
);

export const store = configureStore({
  reducer: {
    user: persistedReducerUser,
   setting:persistedReducerSetting,
   app :persistedReducerApp,
  },

  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),

})
export const persistor = persistStore(store)
