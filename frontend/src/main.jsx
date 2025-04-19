import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import {BrowserRouter} from 'react-router-dom'
import AppContextProvider from './contexts/AppContext.jsx'
import { Toaster } from 'react-hot-toast';


createRoot(document.getElementById('root')).render(
 
  <BrowserRouter>
   <AppContextProvider>
   <Toaster position="top-center" reverseOrder={false} />
    <App/>
    </AppContextProvider>
   </BrowserRouter>

   

)
