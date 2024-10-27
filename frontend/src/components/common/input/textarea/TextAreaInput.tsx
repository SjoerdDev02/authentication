import { ChangeEvent } from 'react';

import styles from './TextAreaInput.module.scss';

type TextAreaInputProps = {
    disabled?: boolean;
    name?: string;
	// eslint-disable-next-line no-unused-vars
    onChange: (value: string) => void;
    placeholder?: string;
    value: string;
}

const TextAreaInput = (props: TextAreaInputProps) => {
	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		props.onChange(event.target.value);
	};

	return (
		<textarea
			aria-disabled={props.disabled}
			className={styles['text-area-input']}
			disabled={props.disabled}
			name={props.name}
			onChange={handleChange}
			placeholder={props.placeholder}
			value={props.value}
		/>
	);
};

export default TextAreaInput;