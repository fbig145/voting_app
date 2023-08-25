import { useState, useEffect } from 'react';
import React from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from '../constants/constant';
import Login from './Login';
import Finished from './Finished';
import Connected from './Connected';
import '../App.css';

function VotingProcess() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [votingStatus, setVotingStatus] = useState(true);
    const [remainingTime, setRemainingTime] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [number, setNumber] = useState('');
    const [CanVote, setCanVote] = useState(true);
    const [pollIndex, setPollIndex] = useState(0);
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        getOptions();
        getRemainingTime();
        getCurrentStatus();
        loadPolls();
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    });

    async function loadPolls() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        const pollsList = await contractInstance.getAllPolls();
        setPolls(pollsList);
    }

    function selectPoll(event) {
        const selectedIndex = event.target.value;
        setPollIndex(selectedIndex);
    }

    async function vote() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

        const tx = await contractInstance.vote(pollIndex, number);
        await tx.wait();
        canVote();
    }

    async function canVote() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

        const voteStatus = await contractInstance.voters(await signer.getAddress(), pollIndex);
        setCanVote(!voteStatus);
    }

    async function getOptions() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

        const candidatesList = await contractInstance.getAllVotesOfCandidates(pollIndex);
        const formattedCandidates = candidatesList.map((candidate, index) => ({
            index: index,
            name: candidate.name,
            voteCount: candidate.voteCount.toNumber()
        }));
        setCandidates(formattedCandidates);
    }

    async function getRemainingTime() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

        const time = await contractInstance.getRemainingTime();
        setRemainingTime(parseInt(time, 16));
    }

    async function getCurrentStatus() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract (
            contractAddress, contractAbi, signer
        );
        const status = await contractInstance.getVotingStatus();
        console.log(status);
        setVotingStatus(status);
    }

    function handleAccountsChanged(accounts) {
        if (accounts.length > 0 && account !== accounts[0]) {
            setAccount(accounts[0]);
            canVote();
        } else {
            setIsConnected(false);
            setAccount(null);
        }
    }

    async function connectToMetamask() {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(provider);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                setAccount(address);
                console.log("Metamask Connected : " + address);
                setIsConnected(true);
                canVote();
            } catch (err) {
                console.error(err);
            }
        } else {
            console.error("Metamask is not detected in the browser")
        }
    }

    function handleCandidateSelection(index) {
        setNumber(index);
    }
    return React.createElement("div", { className: "App" },
        votingStatus
            ? (isConnected
            ? React.createElement(Connected, {
                key: 'connected',
                account: account,
                candidates: candidates,
                remainingTime: remainingTime,
                selectCandidate: handleCandidateSelection,
                voteFunction: vote,
                showButton: CanVote
            })
            : React.createElement(Login, { connectWallet: connectToMetamask, selectPoll: selectPoll, polls: polls }))
            : React.createElement(Finished)
    );
}

export default VotingProcess;

