import styles from '@/components/navigation/Navigation.module.scss';

import { Flex } from "../common/Flex";

const Navigation = () => {
	return (
		<Flex className={styles['navigation']} width="fill">
			<h4>Navigation</h4>
		</Flex>
	);
};

export default Navigation;