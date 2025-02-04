import { ReactNode } from "react";

import styles from '@/components/authentication/wrappers/AuthFormInput.module.scss';
import { Flex } from "@/components/common/Flex";

type InputElementProps = {
    label: string;
    element: ReactNode;
}

type AuthFormInputProps = {
    header: string;
    inputElements: InputElementProps[];
	error?: string | null;
}

const AuthFormInput = (props: AuthFormInputProps) => {
	return (
		<Flex
			flexDirection="column"
			gap={2}
		>
			<h2 className="label label--big">
				{props.header}
			</h2>

			<Flex
				className={styles['auth-form-input__input-wrapper']}
				gap={4}
			>
				{props.inputElements.map((inputElement, index) => (
					<Flex
						flexDirection="column"
						gap={1}
						key={`input-element-${inputElement.label}-${index}`}
					>
						<span className="label label--dark-grayscale">
							{inputElement.label}
						</span>

						{inputElement.element}
					</Flex>
				))}
			</Flex>

			{props.error && (
				<div className="label medium-error">
					{props.error}
				</div>
			)}
		</Flex>
	);
};

export default AuthFormInput;