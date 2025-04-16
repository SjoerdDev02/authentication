import classNames from "classnames";
import { ChangeEvent, type ClipboardEvent, useState } from "react";

import styles from '@/components/authentication/otc/OTCInput.module.scss';
import { Flex } from "@/components/common/Flex";
import inputStyles from '@/components/common/input/text/TextInput.module.scss';
import { useRefs } from "@/utils/hooks/useRefs";
import { useTriggerOnKeydown } from "@/utils/hooks/useTriggerOnKeydown";

type OTCInputProps = {
  otc: string[]
  onChange: (value: string[]) => void
}

export function OTCInput(props: OTCInputProps) {
	const [activeIndex, setActiveIndex] = useState(0);

	const {
		refs: inputRefs,
		setRef
	} = useRefs<HTMLInputElement>();

	const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		const value = e.target.value.toUpperCase();

		// Only allow alphanumeric characters
		if (!/^[A-Z0-9]$/.test(value)) {
			return;
		}

		// Update the OTC value
		const newOtc = [...props.otc];
		newOtc[index] = value;
		props.onChange(newOtc);

		// Focus next input if available
		if (index < props.otc.length - 1) {
			setActiveIndex(index + 1);

			inputRefs[index + 1]?.focus();
		}
	};

	const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();

		const pastedData = e.clipboardData.getData("text/plain").trim();

		// Filter out non-alphanumeric characters and convert to uppercase
		const validChars = pastedData
			.split("")
			.map((char) => char.toUpperCase())
			.filter((char) => /^[A-Z0-9]$/.test(char))
			.join("");

		// Fill starting from the given index
		const newOtc = [...props.otc];

		for (let i = 0; i < validChars.length && activeIndex + i < newOtc.length; i++) {
			newOtc[activeIndex + i] = validChars[i];
		}

		props.onChange(newOtc);

		// Focus the next empty input or the last input
		const nextEmptyIndex = newOtc.length < props.otc.length
			? newOtc.length
			: props.otc.length - 1;

		setActiveIndex(nextEmptyIndex);

		inputRefs[nextEmptyIndex]?.focus();
	};

	const handleFocus = (index: number) => {
		setActiveIndex(index);

		inputRefs[index]?.select();
	};

	const handleClick = (index: number) => {
		setActiveIndex(index);

		inputRefs[index]?.focus();
	};

	const handleDeleteCharacter = (index: number) => {
		const newOtc = [...props.otc];
		newOtc[index] = '';
		props.onChange(newOtc);

		// Focus previous input if available
		if (index > 0) {
			setActiveIndex(index - 1);

			inputRefs[index - 1]?.focus();
		}
	};

	const handleArrowLeft = (index: number) => {
		if (index > 0) {
			setActiveIndex(index - 1);

			inputRefs[index - 1]?.focus();
		  }
	};

	const handleArrowRight = (index: number) => {
		if (index < props.otc.length - 1) {
			setActiveIndex(index + 1);

			inputRefs[index + 1]?.focus();
		  }
	};

	useTriggerOnKeydown('Backspace', () => handleDeleteCharacter(activeIndex));
	useTriggerOnKeydown('Delete', () => handleDeleteCharacter(activeIndex));
	useTriggerOnKeydown('ArrowLeft', () => handleArrowLeft(activeIndex));
	useTriggerOnKeydown('ArrowRight', () => handleArrowRight(activeIndex));

	return (
		<Flex gap={2}>
			{Array.from({ length: props.otc.length }, (_, index) => (
				<input
					autoFocus={index === 0}
					className={classNames(inputStyles['text-input'], styles['otc-input__input'])}
					data-test="otc-input"
					key={index}
					maxLength={1}
					onChange={(e) => handleChange(e, index)}
					onClick={() => handleClick(index)}
					onFocus={() => handleFocus(index)}
					onPaste={handlePaste}
					ref={element => setRef(element, index)}
					type="text"
					value={props.otc[index]}
				/>
			))}
		</Flex>
	);
}