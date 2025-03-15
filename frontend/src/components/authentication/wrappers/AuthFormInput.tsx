import { ReactNode } from "react";

import styles from '@/components/authentication/wrappers/AuthFormInput.module.scss';
import { Flex } from "@/components/common/Flex";

type InputElementProps = {
    label: string;
    element: ReactNode;
}

type AuthFormInputProps = {
    header?: string;
    inputElements: InputElementProps[];
	error?: string | null;
	dataTest?: string;
}

const AuthFormInput = (props: AuthFormInputProps) => {
	return (
		<Flex
			dataTest={props.dataTest}
			flexDirection="column"
			gap={2}
		>
			{!!props.header && (
				<h2 className="label label--big">
					{props.header}
				</h2>
			)}

			<Flex
				className={styles['auth-form-input__input-wrapper']}
				gap={4}
			>
				{props.inputElements.map((inputElement, index) => (
					<Flex
						flexDirection="column"
						gap={1}
						key={`input-element-${inputElement.label}-${index}`}
						width="fill"
					>
						<span className="label label--dark-grayscale">
							{inputElement.label}
						</span>

						{inputElement.element}
					</Flex>
				))}
			</Flex>

			{props.error && (
				<div
					className="label medium-error"
					data-test="auth-form-input-error-message"
				>
					{props.error}
				</div>
			)}
		</Flex>
	);
};

export default AuthFormInput;