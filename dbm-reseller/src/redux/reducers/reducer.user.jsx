import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  profile: null,
  error: null,
  loading: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    setUserDetails: (state, action) => {
      state.token = action.payload.token;
      state.profile = action.payload.profile;
      state.error = action.payload.error ?? null;
      state.loading = false;
    },

    setProfile: (state, action) => {
      state.profile = action.payload;
    },

    removeUserDetails: (state, action) => {
      state.token = null;
      state.isLogin = false;
      state.profile = null;
      state.error = null;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUserDetails, removeUserDetails, setError,setProfile } = userSlice.actions

export default userSlice.reducer