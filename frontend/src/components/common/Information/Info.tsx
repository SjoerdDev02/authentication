import { useState } from 'react';

import { FilledInfoIcon, OpenInfoIcon } from '@/components/svg/InfoIcons';

import styles from './Info.module.scss';
import Tooltip from './Tooltip';

type InfoPropsType = {
	tooltipText: string;
}

const Info = (props: InfoPropsType) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Tooltip
			action="hover"
			position="auto"
			text={props.tooltipText}
		>
			<div
				className={styles.info}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{isHovered ? (
					<FilledInfoIcon className={styles['info__icon']} />
				) : (
					<OpenInfoIcon className={styles['info__icon']} />
				)}
			</div>
		</Tooltip>
	);
};

export default Info;