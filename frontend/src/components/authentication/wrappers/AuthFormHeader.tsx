import { Icon } from '@tabler/icons-react';

import styles from '@/components/authentication/wrappers/AuthFormHeader.module.scss';
import { Flex } from '@/components/common/Flex';

type AuthFormHeaderProps = {
    icon: Icon;
    label: string;
}

const AuthFormHeader = (props: AuthFormHeaderProps) => {
	return (
		<Flex
			alignItems="center"
			className={styles['form-header']}
			flexDirection="column"
			gap={5}
		>
			<Flex
				alignItems="center"
				borderRadius="round"
				className={styles['form-header__icon-wrapper']}
				justifyContent="center"
				padding={3}
			>
				<props.icon />
			</Flex>

			<span className="label label--dark-grayscale label--big">
				{props.label}
			</span>
		</Flex>
	);
};

export default AuthFormHeader;