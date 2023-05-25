import React from 'react';
import './App.css';
import Films from "./pages/Films";
import NotFound from "./pages/NotFound";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navigation";
import { ThemeProvider } from '@emotion/react';
import {theme} from "./theme";
import {SearchContext} from "./contexts/search-context";
import Film from "./pages/Film";
import {SignIn} from "./components/SignIn";
import SignUp from "./pages/SignUp";
import {isLoggedIn} from "./services/UserService";


function App() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [openLogin, setOpenLogin] = React.useState(false);

  return (
      <ThemeProvider theme={theme}>
          <div className="App">
              <Router>
                  <SearchContext.Provider value={{searchTerm, setSearchTerm}}>
                      <Navbar setOpenLogin={setOpenLogin}/>
                      <SignIn open={openLogin} setOpenLogin={setOpenLogin}/>
                      <Routes>
                          <Route path="/register" element={<SignUp setOpenLogin={setOpenLogin}/>}/>
                          <Route path="/films" element={<Films/>}/>
                          <Route path="/films/:id" element={<Film/>}/>
                          <Route path="*" element={<NotFound/>}/>
                  </Routes>
                  </SearchContext.Provider>
              </Router>
          </div>
      </ThemeProvider>
  );
}

export default App;
