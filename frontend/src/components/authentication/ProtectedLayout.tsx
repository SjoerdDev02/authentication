'use client';

import { useAuth } from '@/utils/hooks/useAuth';

import Loader from '../common/loaders/Loader';

type ProtectedLayoutProps = {
	children: React.ReactNode
}

const ProtectedLayout = (props: ProtectedLayoutProps) => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<Loader
				color="grayscale"
				size="md"
			/>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<>
			{props.children}
		</>
	);
};

export default ProtectedLayout;