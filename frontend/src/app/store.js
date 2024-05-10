import { configureStore } from '@reduxjs/toolkit'
import filtersReducer from '../components/filtersSlice'

export const store = configureStore({
  reducer: {
    counter: filtersReducer,
  },
})