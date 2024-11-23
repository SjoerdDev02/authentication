'use client';

import { useActionState, useState } from "react";

import { otcUser } from "@/app/actions/authentication";
// import styles from '@/components/authentication/OTCForm.module.scss';
import Button from "@/components/common/buttons/Button";
import useTranslations from "@/utils/hooks/useTranslations";

import { Flex } from "../common/Flex";
import TextInput from "../common/input/text/TextInput";
import AuthFormWrapper from "./AuthFormWrapper";

type OTCFormProps = {
	onClose: () => void;
}

// TODO: Use these props
// eslint-disable-next-line no-unused-vars
const OTCForm = (props: OTCFormProps) => {
	const translations = useTranslations();

	const initialState = {
		success: true,
		message: ''
	};

	const [state, formAction, isPending] = useActionState(
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
		<AuthFormWrapper action={formAction}>
			<Flex gap={2}>
				{inputItems.map((input, index) => (
					<TextInput
						key={`otc-input-${index}`}
						name={input.inputName}
						onChange={input.updateFunction}
						type="text"
						value={input.inputValue}
					/>
				))}
			</Flex>

			<Button
				color="primary"
				loading={isPending}
				type="submit"
			>
				<span>
					{translations('Authentication.sendLabel')}
				</span>
			</Button>

			{state.message && (
				<div className={state.success ? 'text-green-600' : 'text-red-600'}>
					{state.message}
				</div>
			)}
		</AuthFormWrapper>
	);
};

export default OTCForm;