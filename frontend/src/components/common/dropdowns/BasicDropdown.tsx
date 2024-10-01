import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

import useOutsideClick from '@/utils/hooks/useOutsideClick';

import ArrowDown from '../../../../public/icons/arrow-down.svg';
import styles from './BasicDropdown.module.scss';

export type BasicDropdownItemType = {
	label: string;
	subLabel?: string;
	value: any;
};

type BasicDropdownProps = {
	activeValue: any;
	items: BasicDropdownItemType[];
	onChangeValue: (value: any) => void;
};

const BasicDropdown = (props: BasicDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const activeItemLabel = props.items.find(
		(item) => item.value === props.activeValue
	)?.label;

	const handleClickOutside = () => {
		setIsOpen(false);
	};

	const ref = useOutsideClick(handleClickOutside);

	function toggleDropdown() {
		setIsOpen((prev) => !prev);
	}

	function handleChangeValue(value: string) {
		props.onChangeValue(value);
	}

	return (
		<article
			className={`${styles['basic-dropdown']}
			${isOpen && styles['basic-dropdown--active']}
			`}
			onClick={toggleDropdown}
			ref={ref}
		>
			<article className={styles['basic-dropdown__header']}>
				<label
					className={`label label--bold label--clickable ${styles['basic-dropdown__header__label']}`}
				>
					{activeItemLabel}
					<Image alt="Arrow icon" src={ArrowDown} />
				</label>
			</article>

			<AnimatePresence>
				{isOpen && (
					<motion.article
						animate={{ opacity: 1, y: 0 }}
						className={styles['basic-dropdown__body']}
						exit={{ opacity: 0, y: -10 }}
						initial={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
					>
						<article>
							{props.items.map((item, index) => (
								<article
									className={`${
										styles['basic-dropdown__list-item']
									}
							${
								item.value === props.activeValue &&
								styles['basic-dropdown__list-item--active']
								}
							`}
									key={index}
									onClick={() =>
										handleChangeValue(item.value)
									}
								>
									<label className="label label--clickable">
										{item.label}
									</label>

									{item.subLabel && (
										<label className="label label--small label--light label--clickable">
											{item.subLabel}
										</label>
									)}
								</article>
							))}
						</article>
					</motion.article>
				)}
			</AnimatePresence>
		</article>
	);
};

export default BasicDropdown;
