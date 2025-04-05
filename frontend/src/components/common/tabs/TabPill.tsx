import classNames from 'classnames';
import { CSSProperties, useState } from 'react';

import { Flex } from '@/components/common/Flex';
import styles from '@/components/common/tabs/TabPill.module.scss';

export type TabPillItemType<T> = {
	label: string;
	value: T;
};

type TabPillProps<T> = {
	activeValue: T;
	items: TabPillItemType<T>[];
	onChangeValue: (value: T) => void;
};

const TabPill = <T extends string>(props: TabPillProps<T>) => {
	const [activeItemIndex, setActiveItemIndex] = useState(0);

	function handleChangeValue(value: T, index: number) {
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