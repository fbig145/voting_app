import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from '../constants/constant';
import {Link} from "react-router-dom";

function Polls() {
    const [polls, setPolls] = useState([]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    async function loadPolls() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        const pollsList = await contractInstance.getAllPolls();
        setPolls(pollsList);
    }

    async function deleteCandidate(pollIndex, candidateName) {
        try {
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
            const tx = await contractInstance.deleteCandidate(pollIndex, candidateName);
            await tx.wait();
            alert('Candidate deleted successfully!');
            loadPolls();
        } catch (err) {
            console.error(err);
            alert('An error occurred while deleting the candidate');
        }
    }

    async function deletePoll(index) {
        try {
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
            const tx = await contractInstance.deletePoll(index);
            await tx.wait();
            alert('Poll deleted successfully!');
            loadPolls();
        } catch (err) {
            console.error(err);
            alert('An error occurred while deleting the poll');
        }
    }

    useEffect(() => {
        loadPolls();
    }, []);

    return (
        <div className="container">
            <div className="box-title">
                <h1 className="title">Polls</h1>
            </div>
            <div className="polls-grid">
                {polls.map((poll, pollIndex) => (
                    <div className="poll-container" key={pollIndex}>
                        <h2>Poll: {poll.name}</h2>
                        <button className="button" onClick={() => deletePoll(pollIndex)}>Delete Poll</button>
                        <table className="candidates-table">
                            <tbody>
                            {poll.candidates.map((candidate, index) => (
                                <tr key={index}>
                                    <td className="candidate-name">{candidate.name}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <button className="button" onClick={() => deleteCandidate(pollIndex, candidate.name)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            <Link to="/admin">
                <button className="button">Back</button>
            </Link>
        </div>
    );
}

export default Polls;
