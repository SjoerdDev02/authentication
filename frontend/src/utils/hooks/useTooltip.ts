import { MutableRefObject, useEffect, useState } from 'react';

import { TooltipPositions } from '@/components/common/Information/Tooltip';


const useTooltip = (
	initialPosition: TooltipPositions,
	tooltipRef: MutableRefObject<HTMLDivElement | null>
) => {
	const [tooltipPosition, setTooltipPosition] = useState(initialPosition);

	useEffect(() => {
		if (!tooltipRef.current || initialPosition !== 'auto') return;

		const tooltipBounds = tooltipRef.current.getBoundingClientRect();

		const tooltipSpace = {
			top: tooltipBounds.top,
			right: window.innerWidth - tooltipBounds.right,
			bottom: window.innerHeight - tooltipBounds.bottom,
			left: tooltipBounds.left
		};

		const tooltipSideValues = Object.entries(tooltipSpace).reduce(
			(maxPosition, [side, value]) => (value > maxPosition[1] ? [side, value] : maxPosition),
			['top', tooltipSpace.top]
		) as [TooltipPositions, number];

		setTooltipPosition(tooltipSideValues[0]);
	}, [initialPosition, tooltipRef]);

	return tooltipPosition;
};

// TODO: Make this hook work
// const useTooltip = (
// 	initialPosition: TooltipPositions,
// 	tooltipRef: MutableRefObject<HTMLDivElement | null>
// ) => {
// 	const [tooltipPosition, setTooltipPosition] = useState(initialPosition);
// 	const [maxTooltipWidth, setMaxTooltipWidth] = useState(0);
// 	const [maxTooltipHeight, setMaxTooltipHeight] = useState(0);

// 	useEffect(() => {
// 		if (!tooltipRef.current) return;

// 		const tooltipMargin = 20 + 12.8;
// 		const tooltipWidthThreshold = 150;
// 		const tooltipHeightThreshold = 100;

// 		const tooltipBounds = tooltipRef.current.getBoundingClientRect();

// 		const tooltipSpace = {
// 			top: tooltipBounds.top,
// 			right: window.innerWidth - tooltipBounds.right,
// 			bottom: window.innerHeight - tooltipBounds.bottom,
// 			left: tooltipBounds.left
// 		};

// 		const minWidth = Math.max(Math.min(tooltipSpace.left, tooltipSpace.right) * 2 - tooltipMargin, 0);
// 		const maxWidth = Math.max(Math.max(tooltipSpace.left, tooltipSpace.right) * 2 - tooltipMargin, 0);
// 		const minHeight = Math.max(Math.min(tooltipSpace.top, tooltipSpace.bottom) - tooltipMargin, 0);
// 		const maxHeight = Math.max(Math.max(tooltipSpace.top, tooltipSpace.bottom) - tooltipMargin, 0);

// 		if (initialPosition === 'left' || initialPosition === 'right') {
// 			if (tooltipSpace[initialPosition] >= tooltipWidthThreshold) {
// 				setMaxTooltipWidth(tooltipSpace[initialPosition] - tooltipMargin);
// 				setMaxTooltipHeight(minHeight);

// 				return;
// 			} else if (maxWidth >= tooltipWidthThreshold) {
// 				setTooltipPosition(initialPosition === 'left' ? 'right' : 'left');
// 				setMaxTooltipWidth((initialPosition === 'left' ? tooltipSpace.right : tooltipSpace.left) - tooltipMargin);
// 				setMaxTooltipHeight(minHeight);

// 				return;
// 			} else if (maxHeight >= tooltipHeightThreshold) {
// 				setTooltipPosition(tooltipSpace.top > tooltipSpace.bottom ? 'top' : 'bottom');
// 				setMaxTooltipWidth((tooltipSpace.top > tooltipSpace.bottom ? tooltipSpace.top : tooltipSpace.bottom) - tooltipMargin);
// 				setMaxTooltipHeight((tooltipSpace.top > tooltipSpace.bottom ? tooltipSpace.top : (window.innerHeight - tooltipSpace.bottom)) - tooltipMargin);

// 				return;
// 			} else {
// 				setMaxTooltipWidth(tooltipSpace[initialPosition] - tooltipMargin);
// 				setMaxTooltipHeight(minHeight);

// 				return;
// 			}
// 		} else {
// 			if (tooltipSpace[initialPosition] >= tooltipHeightThreshold) {
// 				setMaxTooltipHeight(tooltipSpace[initialPosition] - tooltipMargin);
// 				setMaxTooltipWidth(minWidth);

// 				return;
// 			} else if (maxHeight >= tooltipHeightThreshold) {
// 				setTooltipPosition(initialPosition === 'top' ? 'top' : 'bottom');
// 				setMaxTooltipHeight((initialPosition === 'top' ? tooltipSpace['top'] : tooltipSpace['bottom']) - tooltipMargin);
// 				setMaxTooltipWidth(minWidth);

// 				return;
// 			} else if (maxWidth >= tooltipWidthThreshold) {
// 				setTooltipPosition(tooltipSpace['left'] > tooltipSpace['right'] ? 'left' : 'right');
// 				setMaxTooltipHeight((tooltipSpace.top > tooltipSpace.bottom ? tooltipSpace.top : (window.innerHeight - tooltipSpace.bottom)) - tooltipMargin);
// 				setMaxTooltipWidth((tooltipSpace.top > tooltipSpace.bottom ? tooltipSpace.top : tooltipSpace.bottom) - tooltipMargin);

// 				return;
// 			} else {
// 				setMaxTooltipHeight(tooltipSpace[initialPosition] - tooltipMargin);
// 				setMaxTooltipWidth(minWidth);

// 				return;
// 			}
// 		}
// 	}, [initialPosition, tooltipRef]);

// 	return { tooltipPosition, maxTooltipWidth, maxTooltipHeight };
// };

export default useTooltip;
