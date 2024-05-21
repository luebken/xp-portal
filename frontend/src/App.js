import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file

function App() {
    const [name, setName] = useState('');
    const [image, setImage] = useState('nginx');
    const [message, setMessage] = useState('');
    const [pods, setPods] = useState([]);

    useEffect(() => {
        fetchPods();
    }, []);

    const fetchPods = async () => {
        try {
            const response = await axios.get('http://localhost:3000/list-pods');
            setPods(response.data);
        } catch (error) {
            console.error("Error fetching pods:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/create-pod', { name, image });
            setMessage(`Pod created: ${response.data.metadata.name}`);
            fetchPods(); // Refresh the pod list after creating a new pod
        } catch (error) {
            setMessage(`Error creating pod: ${error.response.data.error}`);
        }
    };

    return (
        <div>
            <h1 className="header">Create Kubernetes Pod</h1>
            <form onSubmit={handleSubmit} className="header">
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

            <h2 className="header">List of Pods</h2>
            <div className="container">
                {pods.map((pod) => (
                    <div key={pod.name} className="card">
                        <h3>{pod.name}</h3>
                        <p><strong>Ready:</strong> {pod.ready}</p>
                        <p><strong>Status:</strong> {pod.status}</p>
                        <p><strong>Restarts:</strong> {pod.restarts}</p>
                        <p><strong>Age:</strong> {new Date(pod.age).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
