import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import './styles.css';  // Import the CSS file

function CreatePod() {
    const [name, setName] = useState('');
    const [image, setImage] = useState('nginx');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();  // Initialize the useNavigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/create-pod', { name, image });
            setMessage(`Pod created: ${response.data.metadata.name}`);
            navigate('/');  // Redirect to the homepage
        } catch (error) {
            setMessage(`Error creating pod: ${error.response.data.error}`);
        }
    };

    return (
        <div className="create-pod-page">
            <h1 className="header">Create Kubernetes Pod</h1>
            <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
                <div>
                    <label>Pod Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Pod Image:</label>
                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
                </div>
                <button type="submit">Create Pod</button>
            </form>
            {message && <p className="header">{message}</p>}
        </div>
    );
}

export default CreatePod;
