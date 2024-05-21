import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [name, setName] = useState('');
    const [image, setImage] = useState('nginx');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/create-pod', { name, image });
            setMessage(`Pod created: ${response.data.metadata.name}`);
        } catch (error) {
            setMessage(`Error creating pod: ${error.response.data.error}`);
        }
    };

    return (
        <div>
            <h1>Create Kubernetes Pod</h1>
            <form onSubmit={handleSubmit}>
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
            {message && <p>{message}</p>}
        </div>
    );
}

export default App;
