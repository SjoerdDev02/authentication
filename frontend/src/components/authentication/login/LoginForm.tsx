'use client';

import { IconBrandInertia } from "@tabler/icons-react";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { loginUser } from "@/app/actions/authentication";
import styles from '@/components/authentication/login/LoginForm.module.scss';
import Button from "@/components/common/buttons/Button";
import { Flex } from "@/components/common/Flex";
import TextInput from "@/components/common/input/text/TextInput";
import { pages } from "@/constants/routes";
import { useTranslationsContext } from "@/stores/translationsStore";
import userStore from "@/stores/userStore";

import AuthFormFooter from "../wrappers/AuthFormFooter";
import AuthFormHeader from "../wrappers/AuthFormHeader";
import AuthFormWrapper from "../wrappers/AuthFormWrapper";

export type LoginUser = {
	email: string;
	password: string;
}

const LoginForm = () => {
	const getTranslation = useTranslationsContext();
	const router = useRouter();

	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLoginUser = async () => {
		setIsPending(true);

		const result = await loginUser({
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
				userStore.user = result.data;
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
				<Flex
					flexDirection="column"
					gap={3}
				>
					<TextInput
						dataTest="login-email-input"
						name="email"
						onChange={(e) => setEmail(e)}
						placeholder={getTranslation('Authentication.emailPlaceholder')}
						type="email"
						value={email}
				 	/>

					<TextInput
						dataTest="login-password-input"
						name="password"
						onChange={(e) => setPassword(e)}
						placeholder={getTranslation('Authentication.passwordPlaceholder')}
						type="password"
						value={password}
				 	/>
				</Flex>

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