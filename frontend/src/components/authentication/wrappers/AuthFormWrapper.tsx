import { ReactNode } from "react";

import styles from '@/components/authentication/wrappers/AuthFormWrapper.module.scss';
import { Flex } from "@/components/common/Flex";

type AuthFormWrapperProps = {
	header?: ReactNode;
	footer?: ReactNode;
    children: ReactNode;
    className?: string;
}

const AuthFormWrapper = (props: AuthFormWrapperProps) => {
	return (
		<Flex
			className="form"
			dataTest="form"
			flexDirection="column"
			gap={7}
		>
			{props.header}

			<div
				className={styles['form']}
			>
				{props.children}
			</div>

			{props.footer}
		</Flex>
	);
};

export default AuthFormWrapper;