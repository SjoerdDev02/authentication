'use client';

import { useState } from "react";
import { useFormState } from 'react-dom';

import { otcUser } from "@/app/actions/authentication";
import styles from '@/components/authentication/OTCForm.module.scss';
import Button from "@/components/common/buttons/Button";

import TextInput from "../common/input/text/TextInput";

type OTCFormProps = {
	onClose: () => void;
}

const OTCForm = (props: OTCFormProps) => {
	const initialState = {
		success: true,
		message: ''
	};

	const [state, formAction] = useFormState(
		otcUser,
		initialState
	);

	const [characterOne, setCharacterOne] = useState('');
	const [characterTwo, setCharacterTwo] = useState('');
	const [characterThree, setCharacterThree] = useState('');
	const [characterFour, setCharacterFour] = useState('');
	const [characterFive, setCharacterFive] = useState('');
	const [characterSix, setCharacterSix] = useState('');

	const inputItems = [
		{
			inputName: 'characterOne',
			inputValue: characterOne,
			updateFunction: setCharacterOne
		},
		{
			inputName: 'characterTwo',
			inputValue: characterTwo,
			updateFunction: setCharacterTwo
		},
		{
			inputName: 'characterThree',
			inputValue: characterThree,
			updateFunction: setCharacterThree
		},
		{
			inputName: 'characterFour',
			inputValue: characterFour,
			updateFunction: setCharacterFour
		},
		{
			inputName: 'characterFive',
			inputValue: characterFive,
			updateFunction: setCharacterFive
		},
		{
			inputName: 'characterSix',
			inputValue: characterSix,
			updateFunction: setCharacterSix
		}
	];

	return (
		<form
			action={formAction}
			className={styles['user-entry__form']}
		>
			{inputItems.map((input, index) => (
				<TextInput
					key={`otc-input-${index}`}
					name={input.inputName}
					onChange={input.updateFunction}
					type="text"
					value={input.inputValue}
				/>
			))}

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
	);
};

export default OTCForm;