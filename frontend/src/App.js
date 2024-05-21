import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PodDetails from './PodDetails';
import './styles.css';  // Import the CSS file

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
        <Router>
            <Routes>
                <Route path="/pod-details/:namespace/:name" element={<PodDetails />} />
                <Route path="/" element={
                    <div>
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

                        <h2 className="header">List of Pods</h2>
                        <div className="container">
                            {pods.map((pod) => (
                                <Link to={`/pod-details/${pod.namespace}/${pod.name}`} key={pod.name} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="card">
                                        <h3>{pod.name}</h3>
                                        <p><strong>Namespace:</strong> {pod.namespace}</p>
                                        <p><strong>Ready:</strong> {pod.ready}</p>
                                        <p><strong>Status:</strong> {pod.status}</p>
                                        <p><strong>Restarts:</strong> {pod.restarts}</p>
                                        <p><strong>Age:</strong> {new Date(pod.age).toLocaleString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                } />
            </Routes>
        </Router>
    );
}

export default App;
