'use client';

import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { useSnapshot } from "valtio";

import { deleteUser, updateUser } from "@/app/actions/authentication";
import styles from '@/components/authentication/UpdateForm.module.scss';
import Button from "@/components/common/buttons/Button";
import userStore from "@/states/userStore";
import useTranslations from "@/utils/hooks/useTranslations";

import { Flex } from "../common/Flex";
import TextInput from "../common/input/text/TextInput";
import AuthFormWrapper from "./AuthFormWrapper";

const UpdateForm = () => {
	const translations = useTranslations();
	const router = useRouter();
	const userStoreSnap = useSnapshot(userStore);

	const userId = userStoreSnap.id;
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');

	const initialState = {
		success: true,
		message: ''
	};

	const handleUpdateUser = async (prevState: any, formData: FormData) => {
		const result = await updateUser(prevState, formData, userId);

		if (result.success) {
			router.push('/otc');
		}

		return result;
	};

	const handleDeleteUser = async () => {
		const result = await deleteUser(userId);

		if (result.success) {
			router.push('/otc');
		}

		return result;
	};

	const [state, formAction, isPending] = useActionState(handleUpdateUser, initialState);

	return (
		<Flex
			className={styles['update-user']}
			flexDirection="column"
			gap={2}
		>
			<AuthFormWrapper action={formAction}>
				<div className={styles['update-user__input-wrapper']}>
					<TextInput
						name="userId"
						type="hidden"
						value={userId}
					/>

					<TextInput
						name="email"
						onChange={(e) => setEmail(e)}
						placeholder={translations('Authentication.emailPlaceholder')}
						type="email"
						value={email}
					/>

					<TextInput
						name="name"
						onChange={(e) => setName(e)}
						placeholder={translations('Authentication.namePlaceholder')}
						type="text"
						value={name}
					/>

					<TextInput
						name="password"
						onChange={(e) => setPassword(e)}
						placeholder={translations('Authentication.passwordPlaceholder')}
						type="password"
						value={password}
					/>

					<TextInput
						name="passwordConfirmation"
						onChange={(e) => setPasswordConfirmation(e)}
						placeholder={translations('Authentication.passwordConfirmPlaceholder')}
						type="password"
						value={passwordConfirmation}
					/>
				</div>

				<Button
					color="primary"
					loading={isPending}
					type="submit"
				>
					<span>
						{translations('Authentication.updateLabel')}
					</span>
				</Button>

				{state.message && (
					<div className={state.success ? 'text-green-600' : 'text-red-600'}>
						{state.message}
					</div>
				)}
			</AuthFormWrapper>

			<Button
				color="warning"
				onClick={handleDeleteUser}
			>
				<span>
					{translations('Authentication.deleteLabel')}
				</span>
			</Button>
		</Flex>
	);
};

export default UpdateForm;

