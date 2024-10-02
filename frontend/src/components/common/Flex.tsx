import React, { CSSProperties } from 'react';

import styles from './Flex.module.scss';

const gapMapping = {
	0: '0rem',
	1: 'var(--gap-100)',
	2: 'var(--gap-200)',
	3: 'var(--gap-300)',
	4: 'var(--gap-400)',
	5: 'var(--gap-500)',
	6: 'var(--gap-600)',
	7: 'var(--gap-700)',
	8: 'var(--gap-800)',
	9: 'var(--gap-900)',
};

const paddingMapping = {
	0: '0rem',
	1: 'var(--padding-100)',
	2: 'var(--padding-200)',
	3: 'var(--padding-300)',
	4: 'var(--padding-400)',
	5: 'var(--padding-500)',
	6: 'var(--padding-600)',
	7: 'var(--padding-700)',
	8: 'var(--padding-800)',
	9: 'var(--padding-900)',
};

const borderRadiusMapping = {
	0: 'var(--border-radius-0',
	1: 'var(--border-radius-100)',
	2: 'var(--border-radius-200)',
	3: 'var(--border-radius-300)',
	4: 'var(--border-radius-400)',
	5: 'var(--border-radius-500)',
	'round': 'var(--border-radius-round)'
};

type FlexDirectionOptions =
	'row'
	| 'column'
	| 'row-reverse'
	| 'column-reverse';

type JustifyContentOptions =
	| 'flex-start'
	| 'flex-end'
	| 'center'
	| 'space-between'
	| 'space-around'
	| 'initial'
	| 'inherit';

type AlignItemsOptions =
	| 'stretch'
	| 'center'
	| 'space-between'
	| 'flex-start'
	| 'flex-end'
	| 'baseline'
	| 'initial'
	| 'inherit';

type FlexWrapOptions = 'wrap' | 'nowrap' | 'wrap-reverse';

type FlexProps = {
	onClick?: (item?: any) => void;
	style?: CSSProperties;
	as?: keyof JSX.IntrinsicElements;
	children?: React.ReactNode;
	className?: string;

	/****** Container Props ********/
	flexDirection?: FlexDirectionOptions;
	justifyContent?: JustifyContentOptions;
	flexWrap?: FlexWrapOptions;
	alignItems?: AlignItemsOptions;
	gap?: keyof typeof gapMapping;

	/****** Child Props ********/
	flexGrow?: number;
	flexShrink?: number;
	flexBasis?: number;
	flex?: string;

	/****** Common Layout Props ********/
	padding?: keyof typeof paddingMapping;
	paddingX?: keyof typeof paddingMapping;
	paddingY?: keyof typeof paddingMapping;
	borderRadius?: keyof typeof borderRadiusMapping;
	margin?: string;
	width?: string;
	height?: string;
	maxWidth?: string;
	maxHeight?: string;
};

export const Flex = (props: FlexProps) => {
	const Component = props.as || 'div';

	const flexStyleVariables = {
		'--flex-display': 'flex',
		'--flex-justify-content': props.justifyContent,
		'--flex-flex-direction': props.flexDirection,
		'--flex-flex-grow': props.flexGrow,
		'--flex-flex-basis': props.flexBasis,
		'--flex-flex-shrink': props.flexShrink,
		'--flex-flex-wrap': props.flexWrap,
		'--flex-flex': props.flex,
		'--flex-align-items': props.alignItems,
		'--flex-gap': props.gap !== undefined ? gapMapping[props.gap] : undefined,
		'--flex-margin': props.margin,
		'--flex-padding': props.padding !== undefined ? paddingMapping[props.padding] : undefined,
		'--flex-padding-left': props.paddingX !== undefined ? paddingMapping[props.paddingX] : undefined,
		'--flex-padding-right': props.paddingX !== undefined ? paddingMapping[props.paddingX] : undefined,
		'--flex-padding-top': props.paddingY !== undefined ? paddingMapping[props.paddingY] : undefined,
		'--flex-padding-bottom': props.paddingY !== undefined ? paddingMapping[props.paddingY] : undefined,
		'--flex-border-radius': props.borderRadius !== undefined ? borderRadiusMapping[props.borderRadius] : undefined,
		'--flex-width': props.width === 'fill' ? '100%' : props.width,
		'--flex-height': props.height === 'fill' ? '100%' : props.height,
		'--flex-max-width': props.maxWidth,
		'--flex-max-height': props.maxHeight,
	};

	return (
		<Component
			className={`${styles['flex']} ${props.className}`}
			onClick={props.onClick}
			style={{ ...flexStyleVariables } as CSSProperties}
		>
			{props.children}
		</Component>
	);
};
