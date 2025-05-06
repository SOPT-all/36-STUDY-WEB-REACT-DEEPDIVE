//여기서 시작
import { useEffect, useState } from 'react';

export function useCustomQuery(url) {
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            setLoading(true);
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('네트워크 응답 없음');
                const json = await response.json();
                if (isMounted) {
                    setData(json);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err);
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [url]);

    return { data, isLoading, error };
}
