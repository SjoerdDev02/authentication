import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import userStore from '@/states/userStore';

export const useAuth = () => {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			setIsLoading(true);

			const { id, name, email } = userStore;

			if (!!id && !!name && !!email) {
				setIsAuthenticated(true);
			} else {
				router.push('/');
			}

			setIsLoading(false);
		};

		checkAuth();
	}, [router]);

	return { isAuthenticated, isLoading };
};
