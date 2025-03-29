'use client';

import { IconBrandInertia } from "@tabler/icons-react";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthService } from "@/app/services/auth-service";
import styles from '@/components/authentication/login/LoginForm.module.scss';
import Button from "@/components/common/buttons/Button";
import { Flex } from "@/components/common/Flex";
import TextInput from "@/components/common/input/text/TextInput";
import { pages } from "@/constants/routes";
import { useTranslationsContext } from "@/stores/translationsStore";
import { useSetUser } from "@/stores/userStore";

import AuthFormFooter from "../wrappers/AuthFormFooter";
import AuthFormHeader from "../wrappers/AuthFormHeader";
import AuthFormInput from "../wrappers/AuthFormInput";
import AuthFormWrapper from "../wrappers/AuthFormWrapper";

export type LoginUser = {
	email: string;
	password: string;
}

const LoginForm = () => {
	const getTranslation = useTranslationsContext();
	const router = useRouter();

	const setUser = useSetUser();

	const authService = new AuthService();

	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLoginUser = async () => {
		setIsPending(true);

		const result = await authService.loginUser({
			email,
			password
		});

		setIsError(!result.success);
		setMessage(result.message);

		setIsPending(false);

		if (result.success) {
			setEmail('');
			setPassword('');

			router.push(pages.Home.path);

			if (result.data) {
				setUser(result.data);
			}
		}
	};

	const FormHeader = (
		<AuthFormHeader
			icon={IconBrandInertia}
			label={getTranslation('Authentication.signIn')}
		/>
	);

	const FormFooter = (
		<AuthFormFooter
			label={getTranslation('Authentication.dontHaveAnAccount')}
			linkHref={pages.Register.path}
			linkText={getTranslation('Authentication.signUp')}
		/>
	);

	const loginInputs = [
		{
			label: getTranslation('Authentication.emailPlaceholder'),
			element: (
				<TextInput
					dataTest="login-email-input"
					name="email"
					onChange={(e) => setEmail(e)}
					placeholder={getTranslation('Authentication.emailPlaceholder')}
					type="email"
					value={email}
			 />
			)
		},
		{
			label: getTranslation('Authentication.passwordPlaceholder'),
			element: (
				<Flex
					alignItems="flex-end"
					flexDirection="column"
					gap={2}
				>
					<TextInput
						dataTest="login-password-input"
						name="password"
						onChange={(e) => setPassword(e)}
						placeholder={getTranslation('Authentication.passwordPlaceholder')}
						type="password"
						value={password}
				 	/>

					<Link
						className="label label--light-weight label--dark-grayscale"
						href={pages.ResetPassword.path}
						prefetch={false}
					>
						{getTranslation('Authentication.forgotPassword')}
					</Link>
				</Flex>
			)
		}
	];

	useEffect(() => {
		if (!!email || !!password) {
			setIsError(false);
			setMessage(null);
		}
	}, [email, password]);

	const submitDisabled = !email || !password || isError;

	return (
		<Flex
			className={styles['login-form']}
			flexDirection="column"
			gap={5}
		>
			<AuthFormWrapper
				footer={FormFooter}
				header={FormHeader}
			>
				<AuthFormInput
					inputElements={loginInputs}
				/>

				{!!message && (
					<div
						className={classNames('label', `label--${isError ? 'medium-error' : 'medium-success'}`)}
						data-error={isError}
						data-test="login-message"
					>
						{message}
					</div>
				)}

				<Button
					color="primary"
					disabled={submitDisabled}
					loading={isPending}
					onClick={handleLoginUser}
					type="submit"
				>
					<span>
						{getTranslation('Authentication.loginLabel')}
					</span>
				</Button>
			</AuthFormWrapper>
		</Flex>
	);
};

export default LoginForm;