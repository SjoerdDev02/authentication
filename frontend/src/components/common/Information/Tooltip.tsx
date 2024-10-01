import { CSSProperties, ReactNode, useRef, useState } from 'react';

import useTooltip from '@/utils/hooks/useTooltip';

import styles from './Tooltip.module.scss';

export type TooltipPositions = 'auto' | 'top' | 'bottom' | 'left' | 'right';
type TooltipActions = 'click' | 'hover';

type TooltipPropsType = {
	action: TooltipActions;
    children: ReactNode;
	fill?: boolean;
    position: TooltipPositions;
    text: string;
}

const Tooltip = (props: TooltipPropsType) => {
	const [tooltipShown, setTooltipShown] = useState(false);

	const tooltipRef = useRef<HTMLDivElement | null>(null);

	const tooltipPosition = useTooltip(props.position, tooltipRef);

	return (
		<div
			className={`
				${styles.tooltip}
				${props.fill && styles['tooltip--fill']}
			`}
			onClick={() => props.action === 'click' && setTooltipShown(true)}
			onMouseEnter={() => props.action === 'hover' && setTooltipShown(true)}
			onMouseLeave={() => setTooltipShown(false)}
			ref={tooltipRef}
		>
			{props.children}

			<span
				className={`
					${styles['tooltip__text']}
					${styles[`tooltip__text--${tooltipPosition}`]}
					label label--small label--light-grayscale
				`}
				style={{
					'--tooltip-visibility': tooltipShown ? 'visible' : 'hidden'
				} as CSSProperties}
			>
				{props.text}
			</span>
		</div>
	);
};

export default Tooltip;
