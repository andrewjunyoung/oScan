import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Home from './pages/Home.tsx'
import Scan from './pages/Scan.tsx'
import NotFound from './pages/NotFound.tsx'
import Layout from './components/Layout'

const router = createBrowserRouter([
 {
   element: <Layout />,
   children: [
     {
       path: "/",
       element: <Home />
     },
     {
       path: "/scan",
       element: <Scan />
     },
     {
       path: "*",
       element: <NotFound />
     }
   ]
 },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
