'use client';

import { IconBrandZapier } from "@tabler/icons-react";
import classNames from "classnames";
import { useEffect, useState } from "react";

import { registerUser } from "@/app/actions/authentication";
import styles from '@/components/authentication/register/RegisterForm.module.scss';
import Button from "@/components/common/buttons/Button";
import { Flex } from "@/components/common/Flex";
import TextInput from "@/components/common/input/text/TextInput";
import { pages } from "@/constants/routes";
import { useTranslationsContext } from "@/stores/translationsStore";
import { getEmailFeedbackMessage, getPasswordFeedbackMessage, isValidEmail, isValidPassword } from "@/utils/regex";

import AuthFormFooter from "../wrappers/AuthFormFooter";
import AuthFormHeader from "../wrappers/AuthFormHeader";
import AuthFormWrapper from "../wrappers/AuthFormWrapper";

export type RegisterUser = {
	name: string;
	email: string;
	password: string;
	passwordConfirm: string;
}

const Register = () => {
	const getTranslation = useTranslationsContext();
	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');

	const handleRegsterUser = async () => {
		setIsPending(true);

		const result = await registerUser({
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

	useEffect(() => {
		if (!!email && !isValidEmail(email)) {
			setIsError(true);
			setMessage(getTranslation(getEmailFeedbackMessage(email)));

			return;
		} else if (!!password && !isValidPassword(password)) {
			setIsError(true);
			setMessage(getTranslation(getPasswordFeedbackMessage(password)));

			return;
		} else if (!!password && !!passwordConfirm && password !== passwordConfirm) {
			setIsError(true);
			setMessage(getTranslation('Authentication.Errors.passwordMismatch'));

			return;
		} else if (!!message && isError) {
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
				<div className={styles['register-form__input-wrapper']}>
					<TextInput
						dataTest="register-name-input"
						name="name"
						onChange={(e) => setName(e)}
						placeholder={getTranslation('Authentication.namePlaceholder')}
						type="text"
						value={name}
				 	/>

					<TextInput
						dataTest="register-email-input"
						name="email"
						onChange={(e) => setEmail(e)}
						placeholder={getTranslation('Authentication.emailPlaceholder')}
						type="email"
						value={email}
				 	/>

					<TextInput
						dataTest="register-password-input"
						name="password"
						onChange={(e) => setPassword(e)}
						placeholder={getTranslation('Authentication.passwordPlaceholder')}
						type="password"
						value={password}
				 	/>

					<TextInput
						dataTest="register-password-confirm-input"
						name="passwordConfirmation"
						onChange={(e) => setPasswordConfirm(e)}
						placeholder={getTranslation('Authentication.passwordConfirmPlaceholder')}
						type="password"
						value={passwordConfirm}
				 	/>
				</div>

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
					onClick={handleRegsterUser}
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