import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   lang:"en",
   currency: "INR",
   currencyRates:{},
   theme:"light",
   pageTitle:"",
   panel: {}
}

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {

    changeLanguage:(state,action) => {
      state.lang = action.payload;
    },
    changeTheme:(state,action) => {
      state.theme = action.payload;
    },
    changePageTitle:(state,action) => {
      state.pageTitle = action.payload;
    },
    changeCurrency:(state,action) => {
      state.currency = action.payload;
    },
    setCurrencyRates:(state,action) => {
      state.currencyRates = action.payload;
    },
    setPanel:(state,action) => {
      state.panel = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { changeLanguage ,changeTheme,changePageTitle,changeCurrency,setCurrencyRates,setPanel} = settingSlice.actions

export default settingSlice.reducer