import React, { CSSProperties } from 'react';

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

type FlexDirectionOptions = 'row' | 'column';

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

	const flexStyles = {
		display: 'flex',
		...props.justifyContent && { justifyContent: props.justifyContent },
		...props.flexDirection && { flexDirection: props.flexDirection },
		...props.flexGrow !== undefined && { flexGrow: props.flexGrow },
		...props.flexBasis !== undefined && { flexBasis: props.flexBasis },
		...props.flexShrink !== undefined && { flexShrink: props.flexShrink },
		...props.flexWrap && { flexWrap: props.flexWrap },
		...props.flex !== undefined && { flex: props.flex },
		...props.alignItems && { alignItems: props.alignItems },
		...props.gap !== undefined && { gap: gapMapping[props.gap] },
		...props.margin !== undefined && { margin: props.margin },
		...props.padding !== undefined && { padding: paddingMapping[props.padding] },
		...props.paddingX !== undefined && { paddingLeft: paddingMapping[props.paddingX], paddingRight: paddingMapping[props.paddingX] },
		...props.paddingY !== undefined && { paddingTop: paddingMapping[props.paddingY], paddingBottom: paddingMapping[props.paddingY] },
		...props.borderRadius !== undefined && { borderRadius: borderRadiusMapping[props.borderRadius] },
		...props.width && { width: props.width === 'fill' ? '100%' : props.width },
		...props.height && { height: props.height === 'fill' ? '100%' : props.height },
		...props.maxWidth && { maxWidth: props.maxWidth },
		...props.maxHeight && { maxHeight: props.maxHeight },
		...props.style,
	};


	return (
		<Component className={props.className} onClick={props.onClick} style={flexStyles}>
			{props.children}
		</Component>
	);
};
