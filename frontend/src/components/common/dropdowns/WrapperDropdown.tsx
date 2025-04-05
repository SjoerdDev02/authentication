'use client';

import classNames from 'classnames';
import { ReactNode, useState } from 'react';

import Button from '@/components/common/buttons/Button';
import styles from '@/components/common/dropdowns/WrapperDropdown.module.scss';
import useOutsideClick from '@/utils/hooks/useOutsideClick';

export type WrapperDropdownItemType<T> = {
	label: string;
	subLabel?: string;
	value: T;
};

type WrapperDropdownProps<T> = {
	activeValue: unknown;
    children: ReactNode;
	items: WrapperDropdownItemType<T>[];
	onChangeValue: (value: T) => void;
};

const WrapperDropdown = <T extends string>(props: WrapperDropdownProps<T>) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleClickOutside = () => {
		setIsOpen(false);
	};

	const ref = useOutsideClick(handleClickOutside);

	function toggleDropdown() {
		setIsOpen((prev) => !prev);
	}

	function handleChangeValue(value: T) {
		props.onChangeValue(value);
		setIsOpen(false);
	}

	return (
		<article
			className={classNames(styles['basic-dropdown'], {
				[styles['basic-dropdown--active']]: isOpen
			})}
			ref={ref}
		>
			<Button
				color="blank"
				onClick={toggleDropdown}
			>
				{props.children}
			</Button>

			{isOpen && (
				<article className={styles['basic-dropdown__body']}>
					{props.items.map((item, index) => (
						<article
							className={classNames(styles['basic-dropdown__list-item'], {
								[styles['basic-dropdown__list-item--active']]: item.value === props.activeValue
							})}
							key={index}
							onClick={() =>
								handleChangeValue(item.value)
							}
						>
							<label className="label label--clickable">
								{item.label}
							</label>

							{item.subLabel && (
								<label className="label label--small label--light-weight label--clickable">
									{item.subLabel}
								</label>
							)}
						</article>
					))}
				</article>
			)}
		</article>
	);
};

export default WrapperDropdown;
