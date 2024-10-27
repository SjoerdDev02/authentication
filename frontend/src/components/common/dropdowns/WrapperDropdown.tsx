// import { AnimatePresence, motion } from 'framer-motion';
// import { ReactNode, useState } from 'react';

// import useOutsideClick from '@/utils/hooks/useOutsideClick';

// import Button from '../buttons/Button';
// import styles from './WrapperDropdown.module.scss';

// export type WrapperDropdownItemType = {
// 	label: string;
// 	subLabel?: string;
// 	value: any;
// };

// type WrapperDropdownProps = {
// 	activeValue: any;
//     children: ReactNode;
// 	items: WrapperDropdownItemType[];
// 	// eslint-disable-next-line no-unused-vars
// 	onChangeValue: (value: any) => void;
// };

// const WrapperDropdown = (props: WrapperDropdownProps) => {
// 	const [isOpen, setIsOpen] = useState(false);

// 	const handleClickOutside = () => {
// 		setIsOpen(false);
// 	};

// 	const ref = useOutsideClick(handleClickOutside);

// 	function toggleDropdown() {
// 		setIsOpen((prev) => !prev);
// 	}

// 	function handleChangeValue(value: string) {
// 		props.onChangeValue(value);
// 	}

// 	return (
// 		<article
// 			className={`${styles['basic-dropdown']}
// 			${isOpen && styles['basic-dropdown--active']}
// 			`}
// 			ref={ref}
// 		>
// 			<Button
// 				color="blank"
// 				onClick={toggleDropdown}
// 			>
// 				{props.children}
// 			</Button>

// 			<AnimatePresence>
// 				{isOpen && (
// 					<motion.article
// 						animate={{ opacity: 1, y: 0 }}
// 						className={styles['basic-dropdown__body']}
// 						exit={{ opacity: 0, y: -10 }}
// 						initial={{ opacity: 0, y: -10 }}
// 						transition={{ duration: 0.2 }}
// 					>
// 						<article>
// 							{props.items.map((item, index) => (
// 								<article
// 									className={`${
// 										styles['basic-dropdown__list-item']
// 									}
// 							${
// 								item.value === props.activeValue &&
// 								styles['basic-dropdown__list-item--active']
// 								}
// 							`}
// 									key={index}
// 									onClick={() =>
// 										handleChangeValue(item.value)
// 									}
// 								>
// 									<label className="label label--clickable">
// 										{item.label}
// 									</label>

// 									{item.subLabel && (
// 										<label className="label label--small label--light-weight label--clickable">
// 											{item.subLabel}
// 										</label>
// 									)}
// 								</article>
// 							))}
// 						</article>
// 					</motion.article>
// 				)}
// 			</AnimatePresence>
// 		</article>
// 	);
// };

// export default WrapperDropdown;
