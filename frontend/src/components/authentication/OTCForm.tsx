'use client';

import { useParams } from "next/navigation";
import { useActionState, useState } from "react";

import { otcUser } from "@/app/actions/authentication";
import styles from '@/components/authentication/OTCForm.module.scss';
import Button from "@/components/common/buttons/Button";
import useTranslations from "@/utils/hooks/useTranslations";

import { Flex } from "../common/Flex";
import TextInput from "../common/input/text/TextInput";
import AuthFormWrapper from "./AuthFormWrapper";

// TODO: Use these props
// eslint-disable-next-line no-unused-vars
const OTCForm = () => {
	const params = useParams();
	const translations = useTranslations();

	const initialState = {
		success: true,
		message: ''
	};

	const initialCodeCharacters = params.code?.[0]?.split('');

	const [state, formAction, isPending] = useActionState(
		otcUser,
		initialState
	);

	const [characterOne, setCharacterOne] = useState(initialCodeCharacters?.[0] || '');
	const [characterTwo, setCharacterTwo] = useState(initialCodeCharacters?.[1] || '');
	const [characterThree, setCharacterThree] = useState(initialCodeCharacters?.[2] || '');
	const [characterFour, setCharacterFour] = useState(initialCodeCharacters?.[3] || '');
	const [characterFive, setCharacterFive] = useState(initialCodeCharacters?.[4] || '');
	const [characterSix, setCharacterSix] = useState(initialCodeCharacters?.[5] || '');

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
		<Flex
			alignItems="center"
			className={styles['otc-form']}
			flexDirection="column"
			gap={2}
		>
			<h1 className={styles['otc-form__header']}>{translations('Authentication.otcHeader')}</h1>

			<h2 className={styles['otc-form__sub-header']}>{translations('Authentication.otcSubHeader')}</h2>

			<AuthFormWrapper action={formAction}>
				<Flex
					gap={2}
					justifyContent="center"
				>
					{inputItems.map((input, index) => (
						<TextInput
							className={styles['otc-form__input']}
							key={`otc-input-${index}`}
							maxLength={1}
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
		</Flex>
	);
};

export default OTCForm;