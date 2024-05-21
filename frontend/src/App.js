import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PodDetails from './PodDetails';
import CreatePod from './CreatePod';  // Import the CreatePod component
import './styles.css';  // Import the CSS file

function App() {
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

    return (
        <Router>
            <Routes>
                <Route path="/pod-details/:namespace/:name" element={<PodDetails />} />
                <Route path="/create-pod" element={<CreatePod />} />
                <Route path="/" element={
                    <div>
                       <Link to="/create-pod">
                            <button>Create Pod</button>
                        </Link>
                         <h1 className="header">List of Pods</h1>
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
