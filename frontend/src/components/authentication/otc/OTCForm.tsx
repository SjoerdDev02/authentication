'use client';

import classNames from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useRef, useState } from "react";

import { otcUser } from "@/app/actions/authentication";
import styles from '@/components/authentication/otc/OTCForm.module.scss';
import Button from "@/components/common/buttons/Button";
import { initialAuthFormState } from "@/constants/auth";
import userStore from "@/states/userStore";
import useTranslations from "@/utils/hooks/useTranslations";

import { Flex } from "../../common/Flex";
import TextInput from "../../common/input/text/TextInput";
import AuthFormWrapper from "../AuthFormWrapper";

const OTCForm = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const translations = useTranslations();

	const otcCode = searchParams.get('otc');
	const initialCodeCharacters = otcCode ? otcCode.split('') : null;

	const handleOtcUser = async (prevState: any, formData: FormData) => {
		const result = await otcUser(prevState, formData);

		if (result.success) {
			router.push(userStore.name && userStore.email ? '/' : '/entry');

			// Update new name and email here if they changed
			if (result.data?.name && result.data?.email) {
				userStore.name = result.data?.name;
				userStore.email = result.data?.email;
			}
		}

		return result;
	};

	const [state, formAction, isPending] = useActionState(
		handleOtcUser,
		initialAuthFormState
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
		},
		{
			inputName: 'characterTwo',
			inputValue: characterTwo,
			updateFunction: setCharacterTwo,
		},
		{
			inputName: 'characterThree',
			inputValue: characterThree,
			updateFunction: setCharacterThree,
		},
		{
			inputName: 'characterFour',
			inputValue: characterFour,
			updateFunction: setCharacterFour,
		},
		{
			inputName: 'characterFive',
			inputValue: characterFive,
			updateFunction: setCharacterFive,
		},
		{
			inputName: 'characterSix',
			inputValue: characterSix,
			updateFunction: setCharacterSix,
		},
	];

	// eslint-disable-next-line no-unused-vars
	const handleInputChange = (value: string, updateFunction: (newValue: string) => void, index: number) => {
		updateFunction(value);

		if (value.length === 1 && index < inputRefs.current.length - 1) {
			inputRefs.current[index + 1]?.focus();
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
					<div className={classNames('label', `label--${state.success ? 'medium-success' : 'medium-error'}`)}>
						{state.message}
					</div>
				)}
			</AuthFormWrapper>
		</Flex>
	);
};

export default OTCForm;