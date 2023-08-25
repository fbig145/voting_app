import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import '../App.css';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [idPhoto, setIdPhoto] = useState(null);
    const navigate = useNavigate();

    const validateFields = () => {
        if (!username) {
            alert('Username cannot be empty!');
            return false;
        }
        if (!password) {
            alert('Password cannot be empty!');
            return false;
        }
        if (!address) {
            alert('Address cannot be empty!');
            return false;
        }
        if (!firstName) {
            alert('First Name cannot be empty!');
            return false;
        }
        if (!lastName) {
            alert('Last Name cannot be empty!');
            return false;
        }
        if (!email || !email.includes('@')) {
            alert('Please enter a valid email address!');
            return false;
        }
        return true;
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setIdPhoto(file);
    };

    const checkNameInPhoto = () => {
        if (!validateFields()) return;
        if (idPhoto) {
            const reader = new FileReader();
            reader.onload = (e) => {
                Tesseract.recognize(e.target.result)
                    .then(result => {
                        const ocrText = result.data.text;
                        console.log(ocrText);
                        if (ocrText) {
                            const lowerCaseOcrText = ocrText.toLowerCase();
                            const firstNames = firstName.toLowerCase().split(' ');
                            const lastNames = lastName.toLowerCase().split(' ');

                            const firstNameMatches = firstNames.every(name => lowerCaseOcrText.includes(name));
                            const lastNameMatches = lastNames.every(name => lowerCaseOcrText.includes(name));

                            if (firstNameMatches && lastNameMatches && address && lowerCaseOcrText.includes(address.toLowerCase())) {
                                register();
                            } else {
                                alert('First name, last name, or address do not match with the ID photo.');
                            }
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            };
            reader.readAsDataURL(idPhoto);
        }
    };



    const register = () => {
        axios.post('http://localhost:3000/api/user/register', { username, email, firstName, lastName, address, password })
            .then(res => {
                console.log(res.data);
                alert('Registration successful!');
                navigate('/');
            })
            .catch(err => {
                console.error(err);
                alert('User already exists!');
            });
    };

    const goBack = () => {
        navigate('/');
    };

    return (
        <div className="container">
            <h1 className="title">Register</h1>
            <input className="input-field" type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
            <input className="input-field" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input className="input-field" type="text" placeholder="First Name" onChange={e => setFirstName(e.target.value)} />
            <input className="input-field" type="text" placeholder="Last Name" onChange={e => setLastName(e.target.value)} />
            <input className="input-field" type="text" placeholder="Address" onChange={e => setAddress(e.target.value)} />
            <input className="input-field" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <input className="input-field" type="file" accept="image/*" onChange={handleImageUpload} />
            <button className="button" onClick={checkNameInPhoto}>Register</button>
            <button className="button" onClick={goBack}>Back</button>
        </div>
    );
}

export default Register;
