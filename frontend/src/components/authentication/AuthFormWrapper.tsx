import { ReactNode } from "react";

import styles from '@/components/authentication/AuthFormWrapper.module.scss';

type AuthFormWrapperProps = {
    // eslint-disable-next-line no-unused-vars
    action: (payload: FormData) => void;
    children: ReactNode;
    className?: string;
}
const AuthFormWrapper = (props: AuthFormWrapperProps) => {
	return (
		<form
			action={props.action}
			className={styles['form']}
		>
			{props.children}
		</form>
	);
};

export default AuthFormWrapper;