import { ChangeEvent } from 'react';

import styles from './TextInput.module.scss';

type TextInputProps = {
    disabled?: boolean;
    name?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    value: string;
}

const TextInput = (props: TextInputProps) => {
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		props.onChange(event.target.value);
	};

	return (
		<input
			aria-disabled={props.disabled}
			className={styles['text-input']}
			disabled={props.disabled}
			name={props.name}
			onChange={handleChange}
			placeholder={props.placeholder}
			type="text"
			value={props.value}
		/>
	);
};

export default TextInput;