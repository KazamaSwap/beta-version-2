import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { useAppDispatch } from 'state'
import {
  fetchHomepageNews,
} from './stats'
import { State } from './types'

export const useFetchHomepageNews = (isFetching: boolean) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    if (isFetching) {
      dispatch(fetchHomepageNews())
    }
  }, [slowRefresh, isFetching, dispatch])
}