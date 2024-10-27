import { ChangeEvent } from 'react';

import styles from './RangeInput.module.scss';

type RangeInputPropsType = {
    maxValue: number;
    minValue: number;
	// eslint-disable-next-line no-unused-vars
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    value: number;
}

const RangeInput = (props: RangeInputPropsType) => {
	const progress = (
		(props.value - props.minValue) / Math.abs(props.maxValue - props.minValue)
	) * 100;

	return (
		<input
			className={styles['range-input']}
			max={props.maxValue}
			min={props.minValue}
			onChange={props.onChange}
			style={{
				background: `linear-gradient(to right, var(--color-primary-500) ${progress}%, var(--color-primary-100) ${progress}%)`,
			}}
			type="range"
			value={props.value}
		/>
	);
};

export default RangeInput;