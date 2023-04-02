/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StatsState } from 'state/types'
import getHomepageNews from './getHomepageNews'

const initialState: StatsState = {
  isInitialized: false,
  isLoading: true,
  HomepageNews: null,
}

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    statsFetchStart: (state) => {
      state.isLoading = true
    },
    setHomepageNews: (state, action) => {
      state.HomepageNews = action.payload
    },
  },
})

// Actions
export const {
  statsFetchStart,
  setHomepageNews,
} = statsSlice.actions

export const fetchHomepageNews = () => async (dispatch) => {
  const homepageNews = await getHomepageNews()
  dispatch(setHomepageNews(homepageNews))
}

export default statsSlice.reducer