import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

function useFetch<T>(url: string) {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<AxiosError | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response: AxiosResponse<T> = await axios.get(url);

				setData(response.data);
			} catch (error) {
				setError(error as AxiosError);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [url]);

	return { data, isLoading, error };
}

export default useFetch;