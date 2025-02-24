'use client';

import classNames from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { otcUser } from "@/app/actions/authentication";
import styles from '@/components/authentication/otc/OTCForm.module.scss';
import Button from "@/components/common/buttons/Button";
import { pages } from "@/constants/routes";
import { useTranslationsContext } from "@/stores/translationsStore";
import userStore from "@/stores/userStore";

import { Flex } from "../../common/Flex";
import TextInput from "../../common/input/text/TextInput";
import AuthFormWrapper from "../wrappers/AuthFormWrapper";

const OTCForm = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const getTranslation = useTranslationsContext();

	const otcCode = searchParams.get('otc');
	const initialCodeCharacters = otcCode ? otcCode.split('') : null;

	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const [characterOne, setCharacterOne] = useState(initialCodeCharacters?.[0] || '');
	const [characterTwo, setCharacterTwo] = useState(initialCodeCharacters?.[1] || '');
	const [characterThree, setCharacterThree] = useState(initialCodeCharacters?.[2] || '');
	const [characterFour, setCharacterFour] = useState(initialCodeCharacters?.[3] || '');
	const [characterFive, setCharacterFive] = useState(initialCodeCharacters?.[4] || '');
	const [characterSix, setCharacterSix] = useState(initialCodeCharacters?.[5] || '');

	const handleOtcUser = async () => {
		setIsPending(true);

		const result = await otcUser(
			characterOne,
			characterTwo,
			characterThree,
			characterFour,
			characterFive,
			characterSix
		);

		setIsError(!result.success);
		setMessage(result.message);

		setIsPending(false);

		if (result.success) {
			if (result.data) {
				userStore.user = result.data;
			}

			router.push(userStore.user?.name && userStore.user?.email
				? pages.Home.path
				: pages.Login.path
			);
		}
	};

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
			<h1 className={styles['otc-form__header']}>{getTranslation('Authentication.otcHeader')}</h1>

			<h2 className={styles['otc-form__sub-header']}>{getTranslation('Authentication.otcSubHeader')}</h2>

			<AuthFormWrapper>
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
					onClick={handleOtcUser}
					type="submit"
				>
					<span>
						{getTranslation('Authentication.sendLabel')}
					</span>
				</Button>

				{!!message && (
					<div className={classNames('label', `label--${isError ? 'medium-error' : 'medium-success'}`)}>
						{message}
					</div>
				)}
			</AuthFormWrapper>
		</Flex>
	);
};

export default OTCForm;