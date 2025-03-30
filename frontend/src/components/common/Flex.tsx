import classNames from 'classnames';
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
	// eslint-disable-next-line no-unused-vars
	onClick?: (item?: any) => void;
	style?: CSSProperties;
	tag?: keyof React.JSX.IntrinsicElements;
	children?: React.ReactNode;
	className?: string;
	dataTest?: string;

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
	paddingInline?: keyof typeof paddingMapping;
	paddingBlock?: keyof typeof paddingMapping;
	borderRadius?: keyof typeof borderRadiusMapping;
	width?: string;
	height?: string;
	maxWidth?: string;
	maxHeight?: string;
};

export const Flex = (props: FlexProps) => {
	const Component = props.tag || 'div';

	const flexStyleVariables = {
		...props.justifyContent && { '--justify-content': props.justifyContent },
		...props.flexDirection && { '--flex-direction': props.flexDirection },
		...props.flexGrow && { '--flex-grow': props.flexGrow },
		...props.flexBasis && { '--flex-basis': props.flexBasis },
		...props.flexShrink && { '--flex-shrink': props.flexShrink },
		...props.flexWrap && { '--flex-wrap': props.flexWrap },
		...props.flex && { '--flex': props.flex },
		...props.alignItems && { '--align-items': props.alignItems },
		...props.gap !== undefined && { '--gap': gapMapping[props.gap] },
		...props.padding !== undefined && { '--padding': paddingMapping[props.padding] },
		...props.paddingInline !== undefined && { '--padding-inline': paddingMapping[props.paddingInline] },
		...props.paddingBlock !== undefined && { '--padding-block': paddingMapping[props.paddingBlock] },
		...props.borderRadius !== undefined && { '--border-radius': borderRadiusMapping[props.borderRadius] },
		...props.width !== undefined && { '--width': props.width === 'fill' ? '100%' : props.width },
		...props.height !== undefined && { '--height': props.height === 'fill' ? '100%' : props.height },
		...props.maxWidth && { '--max-width': props.maxWidth },
		...props.maxHeight && { '--max-height': props.maxHeight },
		...props.style
	};

	return (
		<Component
			className={classNames(styles['flex'], props.className, {
				[styles['flex--justify-content']]: !!props.justifyContent,
				[styles['flex--flex-direction']]: !!props.flexDirection,
				[styles['flex--flex-grow']]: !!props.flexGrow,
				[styles['flex--flex-basis']]: !!props.flexBasis,
				[styles['flex--flex-shrink']]: !!props.flexShrink,
				[styles['flex-flex-wrap']]: !!props.flexWrap,
				[styles['flex--flex']]: !!props.flex,
				[styles['flex--align-items']]: !!props.alignItems,
				[styles['flex--gap']]: !!props.gap,
				[styles['flex--padding']]: !!props.padding,
				[styles['flex--padding-inline']]: !!props.paddingInline,
				[styles['flex--padding-block']]: !!props.paddingBlock,
				[styles['flex--border-radius']]: !!props.borderRadius,
				[styles['flex--width']]: !!props.width,
				[styles['flex--height']]: !!props.height,
				[styles['flex--max-width']]: !!props.maxWidth,
				[styles['flex--max-height']]: !!props.maxHeight
			})}
			data-test={props.dataTest}
			onClick={props.onClick}
			style={{ ...flexStyleVariables } as CSSProperties}
		>
			{props.children}
		</Component>
	);
};
