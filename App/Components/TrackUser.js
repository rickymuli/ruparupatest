import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Track } from '../Services/MixPanel'

const TrackUser = props => {
  const nav = useSelector(state => state.nav)
  useEffect(() => {
    let navSelected = nav.routes[nav.index]
    let dir = navSelected.routeName
    if (navSelected.routes) dir = navSelected.routes[navSelected.index].routeName
    Track(`Navigate to ${dir}`)
  }, [nav])
  return null
}

export default TrackUser
