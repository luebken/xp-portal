import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

            <h2>List of Pods</h2>
            <table>
                <thead>
                    <tr>
                        <th>NAME</th>
                        <th>READY</th>
                        <th>STATUS</th>
                        <th>RESTARTS</th>
                        <th>AGE</th>
                    </tr>
                </thead>
                <tbody>
                    {pods.map((pod) => (
                        <tr key={pod.name}>
                            <td>{pod.name}</td>
                            <td>{pod.ready}</td>
                            <td>{pod.status}</td>
                            <td>{pod.restarts}</td>
                            <td>{new Date(pod.age).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
