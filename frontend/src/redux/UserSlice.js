import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  currentCourse: null,
  search: false,
};
const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
    },
    setLogOut: (state, action) => {
      localStorage.removeItem("token");
      state.user = null;
    },
    updateName: (state, action) => {
      state.user.name = action.payload.name;
    },
    updateAvatar: (state, action) => {
      state.user.avatar = action.payload.avatar;
    },
    search: (state, action) => {
      state.search = !state.search;
    },
  },
});

export const { setLogin, setLogOut, updateName, updateAvatar, search } =
  UserSlice.actions;
export default UserSlice.reducer;
