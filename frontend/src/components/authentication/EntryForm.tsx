'use client';

import { useState } from "react";
import { useFormState } from 'react-dom';

import { loginUser, registerUser } from "@/app/actions/authentication";
import styles from '@/components/authentication/EntryForm.module.scss';
import Button from "@/components/common/buttons/Button";

import { Flex } from "../common/Flex";
import TextInput from "../common/input/text/TextInput";
import TabPill from "../common/tabs/TabPill";

const EntryForm = () => {
	const initialState = {
		success: true,
		message: ''
	};

	const tabItems = [
		{
			label: 'Login',
			value: false
		},
		{
			label: 'Register',
			value: true
		}
	];

	const [isRegistering, setIsRegistering] = useState(false);

	const [state, formAction] = useFormState(
		isRegistering ? registerUser : loginUser,
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

			<form
				action={formAction}
				className={styles['user-entry__form']}
			>
				<TextInput
					name="email"
					onChange={(e) => setEmail(e)}
					placeholder="Email address"
					type="email"
					value={email}
				 />

				{isRegistering && (
					<TextInput
						name="name"
						onChange={(e) => setName(e)}
						placeholder="Name"
						type="text"
						value={name}
				 	/>
				)}

				<TextInput
					name="password"
					onChange={(e) => setPassword(e)}
					placeholder="Password"
					type="password"
					value={password}
				 />

				{isRegistering && (
					<TextInput
						name="passwordConfirmation"
						onChange={(e) => setPasswordConfirmation(e)}
						placeholder="Confirm password"
						type="password"
						value={passwordConfirmation}
				 	/>
				)}

				<Button
					color="primary"
					type="submit"
				>
					<span>
          				Login
					</span>
				</Button>

				{state.message && (
					<div className={state.success ? 'text-green-600' : 'text-red-600'}>
						{state.message}
					</div>
				)}
			</form>
		</Flex>
	);
};

export default EntryForm;