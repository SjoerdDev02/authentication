'use client';

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useActionState, useRef, useState } from "react";

import { otcUser } from "@/app/actions/authentication";
import styles from '@/components/authentication/OTCForm.module.scss';
import Button from "@/components/common/buttons/Button";
import useTranslations from "@/utils/hooks/useTranslations";

import { Flex } from "../common/Flex";
import TextInput from "../common/input/text/TextInput";
import AuthFormWrapper from "./AuthFormWrapper";

const OTCForm = () => {
	const params = useParams();
	const router = useRouter();
	const translations = useTranslations();

	const initialState = {
		success: true,
		message: ''
	};

	const initialCodeCharacters = params.code?.[0]?.split('');

	const handleOtcUser = async (prevState: any, formData: FormData) => {
		const result = await otcUser(prevState, formData);

		if (result.success) {
			router.push('/welcome');

			// TODO: Update new name and email here if they changed
			// userStore.name = result.data?.name;
			// userStore.email = result.data?.email;
		}

		return result;
	};

	const [state, formAction, isPending] = useActionState(
		handleOtcUser,
		initialState
	);

	const [characterOne, setCharacterOne] = useState(initialCodeCharacters?.[0] || '');
	const [characterTwo, setCharacterTwo] = useState(initialCodeCharacters?.[1] || '');
	const [characterThree, setCharacterThree] = useState(initialCodeCharacters?.[2] || '');
	const [characterFour, setCharacterFour] = useState(initialCodeCharacters?.[3] || '');
	const [characterFive, setCharacterFive] = useState(initialCodeCharacters?.[4] || '');
	const [characterSix, setCharacterSix] = useState(initialCodeCharacters?.[5] || '');

	const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

	const inputItems = [
		{
			inputName: 'characterOne',
			inputValue: characterOne,
			updateFunction: setCharacterOne,
			refIndex: 0,
		},
		{
			inputName: 'characterTwo',
			inputValue: characterTwo,
			updateFunction: setCharacterTwo,
			refIndex: 1,
		},
		{
			inputName: 'characterThree',
			inputValue: characterThree,
			updateFunction: setCharacterThree,
			refIndex: 2,
		},
		{
			inputName: 'characterFour',
			inputValue: characterFour,
			updateFunction: setCharacterFour,
			refIndex: 3,
		},
		{
			inputName: 'characterFive',
			inputValue: characterFive,
			updateFunction: setCharacterFive,
			refIndex: 4,
		},
		{
			inputName: 'characterSix',
			inputValue: characterSix,
			updateFunction: setCharacterSix,
			refIndex: 5,
		},
	];

	// eslint-disable-next-line no-unused-vars
	const handleInputChange = (value: string, updateFunction: (v: string) => void, refIndex: number) => {
		updateFunction(value);

		if (value.length === 1 && refIndex < inputRefs.current.length - 1) {
			inputRefs.current[refIndex + 1]?.focus();
		}
	};

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
							onChange={(value) => handleInputChange(value, input.updateFunction, index)}
							ref={(el) => {
								inputRefs.current[index] = el;
							}}
							type="text"
							upperCase
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