import { createBrowserRouter } from 'react-router'
import Root from './components/Root'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import Activities from './pages/Activities'
import Explore from './pages/Explore'
import Contact from './pages/Contact'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'rooms', Component: Rooms },
      { path: 'activities', Component: Activities },
      { path: 'explore', Component: Explore },
      { path: 'contact', Component: Contact },
    ],
  },
])
