import { createSlice } from "@reduxjs/toolkit";
const initialState = {
 
  search:false
};
const Toggle = createSlice({
  name: "toggle",
  initialState,
  reducers: {
   
    ToggleSearch:(state,action)=>{
      state.search=!state.search
    }
  },
});

export const { ToggleSearch } =
  Toggle.actions;
export default Toggle.reducer;
