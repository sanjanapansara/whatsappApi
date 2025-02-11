import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  notifications: [],
  statistics: {},
  chart: {
    license: [],
    activation: [],
  },
  isLockScreen: false,
  isLockPinEnter: false,
  theme: false,
  isOffer: false,
  isCloseOffer: false,
};

export const productDetails = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setIsDisplayLock: (state, action) => {
      state.isLockScreen = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setStatistics: (state, action) => {
      state.statistics = action.payload;
    },

    setLicenseChartData: (state, action) => {
      state.chart.license = action.payload;
    },
    setActivationChartData: (state, action) => {
      state.chart.activation = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setIsOffer: (state, action) => {
      state.isOffer = action.payload;
    },
    setCloseOffer: (state, action) => {
      console.log("action: ",action.payload)
      state.isCloseOffer = action.payload;
    },
    setIsLockPinEnter: (state, action) => {
      state.isLockPinEnter = action.payload;
    },
  },
});

export const {setIsLockPinEnter,setCloseOffer, setIsOffer, setTheme, setProducts, setIsDisplayLock, setNotifications, setStatistics, setLicenseChartData, setActivationChartData } = productDetails.actions;

export default productDetails.reducer;
