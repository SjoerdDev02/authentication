import { CSSProperties } from 'react';

import styles from './Loader.module.scss';

type LoaderPropsType = {
    color: 'primary' | 'grayscale';
    size: 'sm' | 'md' | 'lg';
}

const colorMap = {
	'primary': 'var(--color-primary-500',
	'grayscale': 'var(--color-grayscale-50'
};

const sizeMap = {
	'sm': '20px',
	'md': '28px',
	'lg': '36px'
};

const Loader = (props: LoaderPropsType) => {
	return (
		<div
			className={styles.loader}
			style={{
				'--loader-color': colorMap[props.color],
				'--loader-size': sizeMap[props.size]
			} as CSSProperties}
		/>
	);
};

export default Loader;