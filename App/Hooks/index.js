import React, { useState, useEffect, useRef } from 'react'
import { Platform } from 'react-native'
const headers = {
  'user-agent': Platform.OS,
  'x-company-name': 'odi'
}
export const initialState = {
  fetching: false,
  data: {},
  error: null
}

export const useKetchup = (url, options, updateState = () => null) => {
  const [data, setData] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = React.useState(null)
  const fetchData = async () => {
    try {
      updateState({ data, error, fetching })
      const res = await fetch(url, { headers, ...options })
      const [item] = await (res.json()).results
      setData(item)
      setFetching(false)
      updateState({ data, fetching, error })
    } catch (error) {
      setError(error)
    }
  }
  useEffect(() => fetchData(), [])
  return { data, fetching, error }
}

export const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export default {
  useKetchup,
  usePrevious
}
