'use client';

import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import { loginUser, registerUser } from "@/app/actions/authentication";
import styles from '@/components/authentication/EntryForm.module.scss';
import Button from "@/components/common/buttons/Button";
import userStore from "@/states/userStore";
import { AuthResponse, MinifiedAuthResponse } from "@/types/Authentication";
import useTranslations from "@/utils/hooks/useTranslations";

import { Flex } from "../common/Flex";
import TextInput from "../common/input/text/TextInput";
import TabPill from "../common/tabs/TabPill";
import AuthFormWrapper from "./AuthFormWrapper";

type initialStateType = {
	success: boolean;
	message: string;
	data: AuthResponse | MinifiedAuthResponse | null;
}

const EntryForm = () => {
	const translations = useTranslations();
	const router = useRouter();

	const [isRegistering, setIsRegistering] = useState(false);

	const initialState: initialStateType = {
		success: true,
		message: '',
		data: null
	};

	const tabItems = [
		{
			label: translations('Authentication.loginLabel'),
			value: false
		},
		{
			label: translations('Authentication.registerLabel'),
			value: true
		}
	];

	const handleRegisterUser = async (prevState: any, formData: FormData) => {
		const result = await registerUser(prevState, formData);

		if (result.success) {
			router.push('/otc');

			userStore.name = result.data?.name;
			userStore.email = result.data?.email;
		}

		return result;
	};

	const handleLoginUser = async (prevState: any, formData: FormData) => {
		const result = await loginUser(prevState, formData);

		if (result.success) {
			router.push('/welcome');

			userStore.id = result.data?.id;
			userStore.name = result.data?.name;
			userStore.email = result.data?.email;
		}

		return result;
	};

	const [state, formAction, isPending] = useActionState(
		isRegistering ? handleRegisterUser : handleLoginUser,
		initialState
	);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');

	return (
		<Flex
			className={styles['user-entry']}
			flexDirection="column"
			gap={5}
		>
			<TabPill
				activeValue={isRegistering}
				items={tabItems}
				onChangeValue={setIsRegistering}
			/>

			<AuthFormWrapper action={formAction}>
				<div className={styles['user-entry__input-wrapper']}>
					<TextInput
						name="email"
						onChange={(e) => setEmail(e)}
						placeholder={translations('Authentication.emailPlaceholder')}
						type="email"
						value={email}
				 	/>

					{isRegistering && (
						<TextInput
							name="name"
							onChange={(e) => setName(e)}
							placeholder={translations('Authentication.namePlaceholder')}
							type="text"
							value={name}
				 	/>
					)}

					<TextInput
						name="password"
						onChange={(e) => setPassword(e)}
						placeholder={translations('Authentication.passwordPlaceholder')}
						type="password"
						value={password}
				 />

					{isRegistering && (
						<TextInput
							name="passwordConfirmation"
							onChange={(e) => setPasswordConfirmation(e)}
							placeholder={translations('Authentication.passwordConfirmPlaceholder')}
							type="password"
							value={passwordConfirmation}
				 	/>
					)}
				</div>

				{state.message && (
					<div className={state.success ? 'text-green-600' : 'text-red-600'}>
						{state.message}
					</div>
				)}

				<Button
					color="primary"
					loading={isPending}
					type="submit"
				>
					<span>
						{translations('Authentication.loginLabel')}
					</span>
				</Button>
			</AuthFormWrapper>
		</Flex>
	);
};

export default EntryForm;