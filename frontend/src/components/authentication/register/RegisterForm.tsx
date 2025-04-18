'use client';

import { IconBrandZapier } from "@tabler/icons-react";
import classNames from "classnames";
import { useEffect, useState } from "react";

import { UserService } from "@/app/services/user-service";
import styles from '@/components/authentication/register/RegisterForm.module.scss';
import AuthFormFooter from "@/components/authentication/wrappers/AuthFormFooter";
import AuthFormHeader from "@/components/authentication/wrappers/AuthFormHeader";
import AuthFormInput from "@/components/authentication/wrappers/AuthFormInput";
import AuthFormWrapper from "@/components/authentication/wrappers/AuthFormWrapper";
import Button from "@/components/common/buttons/Button";
import { Flex } from "@/components/common/Flex";
import TextInput from "@/components/common/input/text/TextInput";
import { pages } from "@/constants/routes";
import { useTranslationsContext } from "@/stores/translationsStore";
import { getEmailFeedbackMessage, getPasswordFeedbackMessage } from "@/utils/regex";

export type RegisterUser = {
	name: string;
	email: string;
	password: string;
	passwordConfirm: string;
}

const Register = () => {
	const getTranslation = useTranslationsContext();

	const userService = new UserService();

	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');

	const handleRegisterUser = async () => {
		setIsPending(true);

		const result = await userService.registerUser({
			name,
			email,
			password,
			passwordConfirm
		});

		setIsError(!result.success);
		setMessage(result.message);

		setIsPending(false);

		if (result.success) {
			setName('');
			setEmail('');
			setPassword('');
			setPasswordConfirm('');
		}
	};

	const FormHeader = (
		<AuthFormHeader
			icon={IconBrandZapier}
			label={getTranslation('Authentication.signUp')}
		/>
	);

	const FormFooter = (
		<AuthFormFooter
			label={getTranslation('Authentication.alreadyHaveAnAccount')}
			linkHref={pages.Login.path}
			linkText={getTranslation('Authentication.signIn')}
		/>
	);

	const nameAndEmailInputs = [
		{
			label: getTranslation('Authentication.namePlaceholder'),
			element: (
				<TextInput
					dataTest="register-name-input"
					name="name"
					onChange={(e) => setName(e)}
					placeholder={getTranslation('Authentication.namePlaceholder')}
					type="text"
					value={name}
		 		/>
			)
		},
		{
			label: getTranslation('Authentication.emailPlaceholder'),
			element: (
				<TextInput
					dataTest="register-email-input"
					name="email"
					onChange={(e) => setEmail(e)}
					placeholder={getTranslation('Authentication.emailPlaceholder')}
					type="email"
					value={email}
	 			/>
			)
		}
	];

	const passwordInputs = [
		{
			label: getTranslation('Authentication.passwordPlaceholder'),
			element: (
				<TextInput
					dataTest="register-password-input"
					name="password"
					onChange={(e) => setPassword(e)}
					placeholder={getTranslation('Authentication.passwordPlaceholder')}
					type="password"
					value={password}
			 	/>
			)
		},
		{
			label: getTranslation('Authentication.passwordConfirmPlaceholder'),
			element: (
				<TextInput
					dataTest="register-password-confirm-input"
					name="passwordConfirmation"
					onChange={(e) => setPasswordConfirm(e)}
					placeholder={getTranslation('Authentication.passwordConfirmPlaceholder')}
					type="password"
					value={passwordConfirm}
				/>
			)
		}
	];

	useEffect(() => {
		if (email) {
			const emailFeedback = getEmailFeedbackMessage(email);

			if (emailFeedback) {
				setIsError(true);
				setMessage(getTranslation(emailFeedback));

				return;
			}
		}

		if (password) {
			const passwordFeedback = getPasswordFeedbackMessage(password);

			if (passwordFeedback) {
				setIsError(true);
				setMessage(getTranslation(passwordFeedback));

				return;
			} else if (password !== passwordConfirm) {
				setIsError(true);
				setMessage(getTranslation('Authentication.Errors.passwordMismatch'));

				return;
			}
		}

		if (!!message && isError) {
			setIsError(false);
			setMessage(null);
		}
	}, [name, email, password, passwordConfirm]);

	const submitDisabled = !name || !email || !password || !passwordConfirm || isError;

	return (
		<Flex
			className={styles['register-form']}
			flexDirection="column"
			gap={5}
		>
			<AuthFormWrapper
				footer={FormFooter}
				header={FormHeader}
			>
				<Flex
					flexDirection="column"
					gap={4}
				>
					<AuthFormInput inputElements={nameAndEmailInputs} />

					<AuthFormInput inputElements={passwordInputs} />
				</Flex>

				{!!message && (
					<div
						className={classNames('label', `label--${isError ? 'medium-error' : 'medium-success'}`)}
						data-error={isError}
						data-test="register-message"
					>
						{message}
					</div>
				)}

				<Button
					color="primary"
					disabled={submitDisabled}
					loading={isPending}
					onClick={handleRegisterUser}
				>
					<span>
						{getTranslation('Authentication.registerLabel')}
					</span>
				</Button>
			</AuthFormWrapper>
		</Flex>
	);
};

export default Register;