'use client';

import { Icon } from '@tabler/icons-react';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';

import Button from '@/components/common/buttons/Button';
import styles from '@/components/common/dropdowns/LinkDropdown.module.scss';
import { Flex } from '@/components/common/Flex';
import useOutsideClick from '@/utils/hooks/useOutsideClick';

export type LinkDropdownItemType = {
	label: string;
	dataTest: string;
	icon: Icon;
	href: string;
};

type LinkDropdownProps = {
	children: ReactNode;
	items: LinkDropdownItemType[];
	listAddition?: ReactNode;
};

const LinkDropdown = (props: LinkDropdownProps) => {
	const pathName = usePathname();

	const [isOpen, setIsOpen] = useState(false);

	const handleClose = () => {
		setIsOpen(false);
	};

	const ref = useOutsideClick(handleClose);

	function toggleDropdown() {
		setIsOpen((prev) => !prev);
	}

	return (
		<article
			className={classNames(styles['link-dropdown'], {
				[styles['link-dropdown--active']]: isOpen
			})}
			data-test="link-dropdown"
			ref={ref}
		>
			<Button
				color="blank"
				dataTest="link-dropdown-toggle"
				onClick={toggleDropdown}
			>
				{props.children}
			</Button>

			{isOpen && (
				<Flex
					className={styles['link-dropdown__body']}
					dataTest="link-dropdown-menu"
					flexDirection="column"
				>
					{props.items.map((item, index) => (
						<Link
							className={classNames(styles['link-dropdown__list-item'], {
								[styles['link-dropdown__list-item--active']]: item.href === pathName
							})}
							data-test={item.dataTest}
							href={item.href}
							key={`link-dropdown-list-item-${index}`}
							onClick={handleClose}
						>
							<label className="label label--clickable">
								{item.label}
							</label>

							<item.icon />
						</Link>
					))}

					{!!props.listAddition && (
						props.listAddition
					)}
				</Flex>
			)}
		</article>
	);
};

export default LinkDropdown;
