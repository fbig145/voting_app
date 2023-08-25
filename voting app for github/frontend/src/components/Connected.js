import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";

const Connected = (props) => {
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const refreshPage = () => {
        window.location.reload();
    };

    // convert seconds to HH:MM:SS format
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${hours}:${mins}:${secs}`;
    };

    // use effect to update the time every second
    const [timeDisplay, setTimeDisplay] = useState(formatTime(props.remainingTime));
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeDisplay(formatTime(props.remainingTime));
        }, 1000);
        return () => clearInterval(timer);
    }, [props.remainingTime]);

    return (
        <div className="container">
            <div className="box-title">
                <h1 className="title">Select your Option</h1>
            </div>
            <p className="connected-account">Metamask Account: {props.account}</p>
            <p className="connected-account">Remaining Time: {timeDisplay}</p>
            { props.showButton ? (
                <button className="button" onClick={props.voteFunction}>Vote</button>
            ) : (
                <p className="connected-account">You have already voted</p>
            )}

            <table id="myTable" className="candidates-table">
                <thead>
                <tr>
                    <th>Index</th>
                    <th>Options</th>
                    <th>Votes</th>
                </tr>
                </thead>
                <tbody>
                {props.candidates.map((candidate, index) => (
                    <tr key={index} className={candidate.index === selectedCandidate ? "selected" : ""} onClick={() => {props.selectCandidate(candidate.index); setSelectedCandidate(candidate.index);}}>
                        <td>{candidate.index}</td>
                        <td>{candidate.name}</td>
                        <td>{candidate.voteCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button className="button" onClick={refreshPage}>Back</button>
            <Link to="/">
                <button className="button">Logout</button>
            </Link>
        </div>
    )
}

export default Connected;
