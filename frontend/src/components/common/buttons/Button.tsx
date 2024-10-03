'use client';

import { CSSProperties, ReactNode, useLayoutEffect, useRef, useState } from 'react';

import Loader from '../loaders/Loader';
import styles from './Button.module.scss';

type ButtonColorType = 'primary' | 'grayscale' | 'success' | 'warning' | 'error' | 'blank';

type ButtonProps = {
	children: ReactNode;
	color: ButtonColorType;
	disabled?: boolean;
	fill?: boolean;
	round?: boolean;
	label?: string;
	loading?: boolean;
	onClick?: () => void;
};

const Button = (props: ButtonProps) => {
	const buttonRef = useRef<HTMLButtonElement>(null);

	const [buttonDimdensions, setbuttonDimdensions] = useState<{ width: number, height: number } | null>(null);

	useLayoutEffect(() => {
		if (!buttonRef.current || !props.children || !props.label) return;

		setbuttonDimdensions({
			width: buttonRef.current.clientWidth,
			height: buttonRef.current.clientHeight
		});
	}, [props.children, props.label]);

	return (
		<button
			aria-disabled={props.disabled}
			className={`
				${styles['button']} 
				${styles[`button--${props.color}`]} 
				${props.fill && styles['button--fill']}
				${props.round && styles['button--round']}
			`}
			disabled={props.disabled}
			onClick={props.onClick}
			ref={buttonRef}
			style={{
				'--button-width': buttonDimdensions?.width ? `${buttonDimdensions.width}px` : 'auto',
				'--button-height': buttonDimdensions?.height ? `${buttonDimdensions.height}px` : 'auto'
			} as CSSProperties}
		>
			{props.loading ? (
				<Loader color="grayscale" size="sm" />
			) : (
				<>
					{props.children}

					{props.label && (
						<span className="label label--light-grayscale label--bold-weight">
							{props.label}
						</span>
					)}
				</>
			)}
		</button>
	);
};

export default Button;