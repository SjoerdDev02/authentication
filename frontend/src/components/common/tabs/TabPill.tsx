import { CSSProperties, useState } from 'react';

import { Flex } from '../Flex';
import styles from './TabPill.module.scss';

export type TabPillItemType = {
	label: string;
	value: any;
};

type TabPillProps = {
	activeValue: any;
	items: TabPillItemType[];
	// eslint-disable-next-line no-unused-vars
	onChangeValue: (value: any) => void;
};

const TabPill = (props: TabPillProps) => {
	const [activeItemIndex, setActiveItemIndex] = useState(0);

	function handleChangeValue(value: string, index: number) {
		props.onChangeValue(value);

		setActiveItemIndex(index);
	}

	return (
		<Flex
			alignItems="center"
			as="article"
			borderRadius={5}
			className={styles['tab-pill']}
			justifyContent="space-between"
			paddingBlock={1}
			paddingInline={1}
			style={{
				'--items-count': props.items.length,
				'--active-item-index': activeItemIndex
			} as CSSProperties}
		>
			{props.items.map((item, index) => (
				<article
					className={`
                        ${styles['tab-pill__item']}
						${index === activeItemIndex && styles['tab-pill__item--active']}
                    `}
					key={`tab-pill-${item.label}-${index}`}
					onClick={() =>
						handleChangeValue(item.value, index)
					}
				>
					<label className={`${styles['tab-pill__item-label']} label`}>
						{item.label}
					</label>
				</article>
		    ))}

			<div className={styles['tab-pill__indicator']} />
		</Flex>
	);
};

export default TabPill;