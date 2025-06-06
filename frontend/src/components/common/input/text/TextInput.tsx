import classNames from 'classnames';
import { ChangeEvent, HTMLInputTypeAttribute, Ref } from 'react';

import styles from '@/components/common/input/text/TextInput.module.scss';

type TextInputProps = {
	className?: string;
    disabled?: boolean;
    name?: string;
    placeholder?: string;
    value: string | number | null;
	type?: HTMLInputTypeAttribute;
	maxLength?: number;
    upperCase?: boolean;
	dataTest?: string;
	ref?: Ref<HTMLInputElement> | null;
    onChange?: (value: string) => void;
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