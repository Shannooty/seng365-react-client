import React from 'react';
import './App.css';
import Films from "./pages/Films";
import NotFound from "./pages/NotFound";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
              <Route path="/films" element={<Films/>}/>
              <Route path="*" element={<NotFound/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;
