import React from "react";
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <div className="login-container">
            <div className="box-title">
                <h1 className="title">Welcome to the Voting Platform!</h1>
            </div>
            <h3 className="welcome-message">Please Select a Poll and Login Metamask:</h3>
            <select className="button" onChange={e => props.selectPoll(e)}>
                {props.polls.map((poll, index) => (
                    <option key={index} value={index}>{poll.name}</option>
                ))}
            </select>
            <button className="button" onClick={props.connectWallet}>Login into Metamask</button>
            <button className="button" onClick={goHome}>Back to Home</button>
        </div>
    )
}

export default Login;
