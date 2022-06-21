import React, { useEffect, useState } from 'react';

const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: (email, password) => {}
})

export const AuthContextProvider = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUserLoggedInfo = localStorage.getItem('isLoggedIn')

    if (storedUserLoggedInfo === '1') {
      setIsLoggedIn(true)
    }
  }, [])

  const logoutHandler = () => {
    localStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false)
  };

  const loginHandler = () => {
    localStorage.setItem('isLoggedIn', '1')
    setIsLoggedIn(true)
  }

  return <AuthContext.Provider value={{
    isLoggedIn,
    onLogin: loginHandler,
    onLogout: logoutHandler
  }}>
            {props.children}
        </AuthContext.Provider>
}

export default AuthContext;

