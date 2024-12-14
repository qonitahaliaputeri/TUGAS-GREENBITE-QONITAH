// src/components/MyComponent.js
import React, { useEffect } from 'react';
import axios from 'axios';

const MyComponent = () => {
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('http://localhost:3005/cart');
            console.log(result.data);
        };
        fetchData();
    }, []);

    return <div>My Component</div>;
};

export default MyComponent;