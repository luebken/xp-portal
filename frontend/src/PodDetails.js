import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function PodDetails() {
    const { namespace, name } = useParams();
    const [podDetails, setPodDetails] = useState(null);

    useEffect(() => {
        fetchPodDetails();
    }, []);

    const fetchPodDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/pod-details/${namespace}/${name}`);
            setPodDetails(response.data);
        } catch (error) {
            console.error("Error fetching pod details:", error);
        }
    };

    if (!podDetails) return <div>Loading...</div>;

    return (
        <div>
            <h1>Pod Details: {name}</h1>
            <pre>{JSON.stringify(podDetails, null, 2)}</pre>
            <Link to="/">Back to Pod List</Link>
        </div>
    );
}

export default PodDetails;
