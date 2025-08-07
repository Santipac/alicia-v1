import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import HomePage from './pages/index.tsx'
import RobotsPage from './pages/robots.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/robots",
    Component: RobotsPage,
  },
]);



createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <RouterProvider router={router} />,
  </StrictMode>,
)
