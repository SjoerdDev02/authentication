import { useEffect, useState } from 'react';

const useDevice = () => {
	const [screenSize, setScreenSize] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			setScreenSize(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return {
		isSmall: screenSize <= 768,
		isMedium: screenSize <= 1024,
		isLarge: screenSize > 1024,
	};
};

export default useDevice;
