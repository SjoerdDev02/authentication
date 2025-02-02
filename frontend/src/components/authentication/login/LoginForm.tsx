'use client';

import { IconBrandInertia } from "@tabler/icons-react";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import { loginUser } from "@/app/actions/authentication";
import styles from '@/components/authentication/login/LoginForm.module.scss';
import Button from "@/components/common/buttons/Button";
import { Flex } from "@/components/common/Flex";
import TextInput from "@/components/common/input/text/TextInput";
import { initialAuthFormState } from "@/constants/auth";
import { pages } from "@/constants/routes";
import { useTranslationsContext } from "@/stores/translationsStore";
import userStore from "@/stores/userStore";

import AuthFormFooter from "../wrappers/AuthFormFooter";
import AuthFormHeader from "../wrappers/AuthFormHeader";
import AuthFormWrapper from "../wrappers/AuthFormWrapper";

const LoginForm = () => {
	const getTranslation = useTranslationsContext();
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLoginUser = async (prevState: any, formData: FormData) => {
		const result = await loginUser(prevState, formData);

		if (result.success) {
			router.push(pages.Home.path);

			if (result.data) {
				userStore.id = result.data.id;
				userStore.name = result.data.name;
				userStore.email = result.data.email;
			}
		}

		return result;
	};

	const [state, formAction, isPending] = useActionState(
		handleLoginUser,
		initialAuthFormState
	);

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

	return (
		<Flex
			className={styles['login-form']}
			flexDirection="column"
			gap={5}
		>
			<AuthFormWrapper
				action={formAction}
				footer={FormFooter}
				header={FormHeader}
			>
				<Flex
					flexDirection="column"
					gap={3}
				>
					<TextInput
						name="email"
						onChange={(e) => setEmail(e)}
						placeholder={getTranslation('Authentication.emailPlaceholder')}
						type="email"
						value={email}
				 	/>

					<TextInput
						name="password"
						onChange={(e) => setPassword(e)}
						placeholder={getTranslation('Authentication.passwordPlaceholder')}
						type="password"
						value={password}
				 	/>
				</Flex>

				{state.message && (
					<div className={classNames('label', `label--${state.success ? 'medium-success' : 'medium-error'}`)}>
						{state.message}
					</div>
				)}

				<Button
					color="primary"
					loading={isPending}
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