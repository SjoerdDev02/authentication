import classNames from 'classnames';
import { ChangeEvent, HTMLInputTypeAttribute, Ref } from 'react';

import styles from './TextInput.module.scss';

type TextInputProps = {
	className?: string;
    disabled?: boolean;
    name?: string;
	dataTest?: string;
	// eslint-disable-next-line no-unused-vars
    onChange?: (value: string) => void;
    placeholder?: string;
    value: string | number | null;
	type?: HTMLInputTypeAttribute;
	maxLength?: number;
    upperCase?: boolean;
	ref?: Ref<HTMLInputElement> | null;
}

const TextInput = (props: TextInputProps) => {
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		let value = event.target.value;

		if (props.upperCase) {
			value = value.toUpperCase();
		}

		props.onChange?.(value);
	};

	return (
		<input
			aria-disabled={props.disabled}
			className={classNames(styles['text-input'], props.className)}
			data-test={props.dataTest}
			disabled={props.disabled}
			maxLength={props.maxLength}
			name={props.name}
			onChange={handleChange}
			placeholder={props.placeholder}
			ref={props.ref || undefined}
			type={props.type || "text"}
			value={props.value || ''}
		/>
	);
};

export default TextInput;