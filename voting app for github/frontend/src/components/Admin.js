import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from '../constants/constant';
import { Link } from 'react-router-dom';
import axios from "axios";

function Admin() {
    const [pollName, setPollName] = useState('');
    const [candidateName, setCandidateName] = useState('');
    const [selectedPollIndex, setSelectedPollIndex] = useState(0);
    const [polls, setPolls] = useState([]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    async function loadPolls() {
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        const pollsList = await contractInstance.getAllPolls();
        setPolls(pollsList);
    }

    async function addPoll() {
        try {
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
            const tx = await contractInstance.addPoll(pollName, []);
            await tx.wait();
            addPollToDb();
            loadPolls();
            alert('Poll added successfully!');
        } catch (err) {
            console.error(err);
            alert('An error occurred while adding the poll');
        }
    }

    async function addOption() {
        try {
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
            const tx = await contractInstance.addCandidate(selectedPollIndex, candidateName);
            await tx.wait();
            updatePollOption();
            alert('Candidate added successfully!');
        } catch (err) {
            console.error(err);
            alert('An error occurred while adding the candidate');
        }
    }

    const addPollToDb = () => {
        axios.post('http://localhost:3000/api/polls', { pollName })
            .then(res => {
                // success
            })
            .catch(err => {
                console.error(err);
            });
    };

    const updatePollOption = () => {
        axios.put('http://localhost:3000/api/polls/' + pollName, { candidateName })
            .then(res => {
                // success
            })
            .catch(err => {
                console.error(err);
            });
    };

    useEffect(() => {
        loadPolls();
    }, []);

    return (
        <div className="container">
            <div className="box-title">
                <h1 className="title">Admin Panel</h1>
            </div>
            <div className="flex-container">
                <div className="left-panel">
                    <input className="input-field" type="text" placeholder="Poll Name" onChange={e => setPollName(e.target.value)} />
                    <button className="button" onClick={addPoll}>Add Poll</button>
                </div>
                <div className="right-panel">
                    <input className="input-field" type="text" placeholder="Option Name" onChange={e => setCandidateName(e.target.value)} />
                    <select className="input-field" onChange={e => setSelectedPollIndex(e.target.value)}>
                        {polls.map((poll, index) => <option value={index} key={index}>{poll.name}</option>)}
                    </select>
                    <button className="button" onClick={addOption}>Add Option</button>
                </div>
            </div>
            <Link to="/">
                <button className="button">Home</button>
            </Link>
            <Link to="/polls">
                <button className="button">Show Polls</button>
            </Link>
        </div>
    );



}

export default Admin;
