import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const login = () => {
        if(username == 'admin' && password == 'admin'){
            navigate('/admin');
        } else {
            axios.post('http://localhost:3000/api/user/login', { username, password })
                .then(res => {
                    console.log(res.data);
                    alert('Login successful!');
                    navigate('/voting');
                })
                .catch(err => {
                    console.error(err);
                    alert('Invalid username or password');
                });
        }
    };

    const redirectToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="container">
            <div className="box-title">
                <h1 className="title">Voting Platform</h1>
            </div>
            <input className="input-field" type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
            <input className="input-field" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button className="button" onClick={login}>Login</button>
            <button className="button" onClick={redirectToRegister}>Register</button>
        </div>
    );
}

export default Home;
