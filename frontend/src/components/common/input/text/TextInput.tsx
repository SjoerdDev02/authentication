import classNames from 'classnames';
import { ChangeEvent, HTMLInputTypeAttribute } from 'react';

import styles from './TextInput.module.scss';

type TextInputProps = {
	className?: string;
    disabled?: boolean;
    name?: string;
	// eslint-disable-next-line no-unused-vars
    onChange?: (value: string) => void;
    placeholder?: string;
    value: string | number | null;
	type?: HTMLInputTypeAttribute;
	maxLength?: number;
}

const TextInput = (props: TextInputProps) => {
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		props.onChange?.(event.target.value);
	};

	return (
		<input
			aria-disabled={props.disabled}
			className={classNames(styles['text-input'], props.className)}
			disabled={props.disabled}
			maxLength={props.maxLength}
			name={props.name}
			onChange={handleChange}
			placeholder={props.placeholder}
			type={props.type || "text"}
			value={props.value || ''}
		/>
	);
};

export default TextInput;