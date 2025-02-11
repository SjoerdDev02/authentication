'use client';

import classNames from 'classnames';
import { CSSProperties, ReactNode, useLayoutEffect, useRef, useState } from 'react';

import Loader from '../loaders/Loader';
import styles from './Button.module.scss';

type ButtonColorType = 'primary' | 'grayscale' | 'success' | 'warning' | 'error' | 'blank';
type ButtonType = 'button' | 'submit';

type ButtonProps = {
	children: ReactNode;
	color: ButtonColorType;
	disabled?: boolean;
	fill?: boolean;
	round?: boolean;
	label?: string;
	loading?: boolean;
	onClick?: () => void;
	type?: ButtonType;
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
			className={classNames(styles['button'], styles[`button--${props.color}`], {
				[styles['button--fill']]: props.fill,
				[styles['button--round']]: props.round
			})}
			data-test="submit-button"
			disabled={props.disabled}
			onClick={props.onClick}
			ref={buttonRef}
			style={{
				'--button-width': buttonDimdensions?.width ? `${buttonDimdensions.width}px` : 'auto',
				'--button-height': buttonDimdensions?.height ? `${buttonDimdensions.height}px` : 'auto'
			} as CSSProperties}
			type={props.type}
		>
			{(props.loading) ? (
				<Loader color="grayscale"
					size="sm" />
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
