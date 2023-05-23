import React from 'react';
import './App.css';
import Films from "./pages/Films";
import NotFound from "./pages/NotFound";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navigation";
import { ThemeProvider } from '@emotion/react';
import {theme} from "./theme";
import {SearchContext} from "./Contexts/search-context";
import Film from "./pages/Film";

function App() {
    const [searchTerm, setSearchTerm] = React.useState('');

  return (
      <ThemeProvider theme={theme}>
          <div className="App">
              <Router>
                  <div>
                      <SearchContext.Provider value={{searchTerm, setSearchTerm}}>
                          <Navbar/>
                          <Routes>
                              <Route path="/films" element={<Films/>}/>
                              <Route path="/film/:id" element={<Film/>}/>
                              <Route path="*" element={<NotFound/>}/>
                          </Routes>
                      </SearchContext.Provider>
                  </div>
              </Router>
          </div>
      </ThemeProvider>
  );
}

export default App;
