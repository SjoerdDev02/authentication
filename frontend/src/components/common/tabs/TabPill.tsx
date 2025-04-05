import classNames from 'classnames';
import { CSSProperties, useState } from 'react';

import { Flex } from '@/components/common/Flex';
import styles from '@/components/common/tabs/TabPill.module.scss';

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
			borderRadius={5}
			className={styles['tab-pill']}
			justifyContent="space-between"
			paddingBlock={1}
			paddingInline={1}
			style={{
				'--items-count': props.items.length,
				'--active-item-index': activeItemIndex
			} as CSSProperties}
			tag="article"
		>
			{props.items.map((item, index) => (
				<article
					className={classNames(styles['tab-pill__item'], {
						[styles['tab-pill__item--active']]: index === activeItemIndex
					})}
					key={`tab-pill-${item.label}-${index}`}
					onClick={() =>
						handleChangeValue(item.value, index)
					}
				>
					<label className={classNames(styles['tab-pill__item-label'], 'label')}>
						{item.label}
					</label>
				</article>
		    ))}

			<div className={styles['tab-pill__indicator']} />
		</Flex>
	);
};

export default TabPill;