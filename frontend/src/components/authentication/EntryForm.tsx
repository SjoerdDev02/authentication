'use client';

import { useState } from "react";
import { useFormState } from 'react-dom';

import { loginUser, registerUser } from "@/app/actions/authentication";
import styles from '@/components/authentication/EntryForm.module.scss';
import Button from "@/components/common/buttons/Button";

import { Flex } from "../common/Flex";
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
			gap={2}
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
				{isRegistering && (
					<input
						name="email"
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email address"
						type="email"
						value={email}
					/>
				)}

				<input
					name="name"
					onChange={(e) => setName(e.target.value)}
					placeholder="Username or Email"
					type="text"
					value={name}
				/>

				<input
					name="password"
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					type="password"
					value={password}
				/>

				{isRegistering && (
					<input
						name="passwordConfirmation"
						onChange={(e) => setPasswordConfirmation(e.target.value)}
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