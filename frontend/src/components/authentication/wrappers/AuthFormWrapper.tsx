import { ReactNode } from "react";

import styles from '@/components/authentication/wrappers/AuthFormWrapper.module.scss';
import { Flex } from "@/components/common/Flex";

type AuthFormWrapperProps = {
    // eslint-disable-next-line no-unused-vars
    action: (payload: FormData) => void;
	header?: ReactNode;
	footer?: ReactNode;
    children: ReactNode;
    className?: string;
}

const AuthFormWrapper = (props: AuthFormWrapperProps) => {
	return (
		<Flex
			className="form"
			flexDirection="column"
			gap={7}
		>
			{props.header}

			<form
				action={props.action}
				className={styles['form']}
			>
				{props.children}
			</form>

			{props.footer}
		</Flex>
	);
};

export default AuthFormWrapper;