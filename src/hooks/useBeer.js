import { useState, useEffect } from 'react';
import { getBeerById } from '../firebase/services';

export const useBeer = (id) => {
    const [beer, setBeer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }
        const fetchBeer = async () => {
            try {
                setLoading(true);
                const data = await getBeerById(id);
                setBeer(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBeer();
    }, [id]);

    return { beer, loading, error };
};
