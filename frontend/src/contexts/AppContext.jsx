import { createContext, useState } from "react";
export const AppContext = createContext()
import React from "react";

const AppContextProvider = ({children}) =>{
    const [email,setEmail] = useState('')
    const [name, setName] = useState('')
    const [isAuthenticated, setIsauthenticated] = useState(false)
    const [showSignup, setShowsignup] = useState(false)
    const value = {
        email,setEmail, isAuthenticated, setIsauthenticated, name, setName, showSignup, setShowsignup
    }
    return (
        <AppContext.Provider value={value}>
          {children}
       </AppContext.Provider>
    );
    
}

export default AppContextProvider