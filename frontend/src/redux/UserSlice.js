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
      console.log(state.user);
      console.log(state.user.user);
      state.user = null;
    },
    updateName: (state, action) => {
      state.user.name = action.payload.name;
      console.log(action.payload.name);
    },
    updateAvatar: (state, action) => {
      state.user.avatar = action.payload.avatar;
    },
    search: (state, action) => {
      console.log("here");
      state.search = !state.search;
    },
  },
});

export const { setLogin, setLogOut, updateName, updateAvatar, search } =
  UserSlice.actions;
export default UserSlice.reducer;
