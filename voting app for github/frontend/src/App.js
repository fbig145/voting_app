import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Polls from "./components/Polls";
import VotingProcess from './components/VotingProcess';
import Admin from "./components/Admin";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/polls" element={<Polls/>} /> {}
                <Route path="/admin" element={<Admin />} /> {}
                <Route path="/voting" element={<VotingProcess />} /> {}
            </Routes>
        </Router>
    );
}

export default App;
