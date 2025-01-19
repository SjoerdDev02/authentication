'use client';

import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import { loginUser, registerUser } from "@/app/actions/authentication";
import { initialAuthFormState } from "@/app/constants/auth";
import styles from '@/components/authentication/EntryForm.module.scss';
import Button from "@/components/common/buttons/Button";
import userStore from "@/states/userStore";
import useTranslations from "@/utils/hooks/useTranslations";

import { Flex } from "../common/Flex";
import TextInput from "../common/input/text/TextInput";
import TabPill from "../common/tabs/TabPill";
import AuthFormWrapper from "./AuthFormWrapper";

const EntryForm = () => {
	const translations = useTranslations();
	const router = useRouter();

	const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

	const tabItems = [
		{
			label: translations('Authentication.loginLabel'),
			value: 'login'
		},
		{
			label: translations('Authentication.registerLabel'),
			value: 'register'
		}
	];

	const handleRegisterUser = async (prevState: any, formData: FormData) => {
		const result = await registerUser(prevState, formData);

		if (result.success) {
			router.push('/otc');

			userStore.name = result.data?.name || null;
			userStore.email = result.data?.email || null;
		}

		return result;
	};

	const handleLoginUser = async (prevState: any, formData: FormData) => {
		const result = await loginUser(prevState, formData);

		if (result.success) {
			router.push('/welcome');

			userStore.id = result.data?.id || null;
			userStore.name = result.data?.name || null;
			userStore.email = result.data?.email || null;
		}

		return result;
	};

	const [state, formAction, isPending] = useActionState(
		activeTab === 'register' ? handleRegisterUser : handleLoginUser,
		initialAuthFormState
	);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');

	const onChangeTab = (value: 'login' | 'register') => {
		setName('');
		setEmail('');
		setPassword('');
		setPasswordConfirmation('');
		setActiveTab(value);
		state.message = '';
	};

	return (
		<Flex
			className={styles['user-entry']}
			flexDirection="column"
			gap={5}
		>
			<TabPill
				activeValue={activeTab}
				items={tabItems}
				onChangeValue={onChangeTab}
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

					{activeTab === 'register' && (
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

					{activeTab === 'register' && (
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
						{translations(`Authentication.${activeTab === 'register' ? 'registerLabel' : 'loginLabel'}`)}
					</span>
				</Button>
			</AuthFormWrapper>
		</Flex>
	);
};

export default EntryForm;