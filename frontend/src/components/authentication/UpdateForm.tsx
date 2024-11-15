'use client';

import { useState } from "react";
import { useFormState } from 'react-dom';

import { deleteUser, updateUser } from "@/app/actions/authentication";
import styles from '@/components/authentication/UpdateForm.module.scss';
import Button from "@/components/common/buttons/Button";

import { Flex } from "../common/Flex";
import TextInput from "../common/input/text/TextInput";

const EntryForm = () => {
	const initialState = {
		success: true,
		message: ''
	};

	const [state, formAction] = useFormState(updateUser, initialState);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');

	return (
		<Flex
			className={styles['update-user']}
			flexDirection="column"
			gap={2}
		>
			<form
				action={formAction}
				className={styles['update-user__form']}
			>
				<TextInput
					name="email"
					onChange={(e) => setEmail(e)}
					placeholder="Email address"
					type="email"
					value={email}
				 />

				<TextInput
					name="name"
					onChange={(e) => setName(e)}
					placeholder="Name"
					type="text"
					value={name}
				 	/>

				<TextInput
					name="password"
					onChange={(e) => setPassword(e)}
					placeholder="Password"
					type="password"
					value={password}
				 />

				<TextInput
					name="passwordConfirmation"
					onChange={(e) => setPasswordConfirmation(e)}
					placeholder="Confirm password"
					type="password"
					value={passwordConfirmation}
				 	/>

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

			<Button color="warning" onClick={deleteUser}>
				<span>Delete account</span>
			</Button>
		</Flex>
	);
};

export default EntryForm;