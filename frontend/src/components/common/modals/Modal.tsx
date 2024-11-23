import classNames from "classnames";
import { ReactNode, useEffect } from "react";
import { MouseEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSnapshot } from "valtio";

import styles from '@/components/common/modals/Modal.module.scss';
import modalStore from "@/states/modalStore";
import { useTriggerOnKeydown } from "@/utils/hooks/useTriggerOnKeydown";

type ModalProps = {
    children: ReactNode;
    className?: string;
    onClose?: () => void;
    size: 'sm' | 'md' | 'lg';
}

const Modal = (props: ModalProps) => {
	const modalStoreSnap = useSnapshot(modalStore);

	const modalRef = useRef<Element | null>(null);

	const [mounted, setMounted] = useState(false);

	function handleBackdropClick(e: MouseEvent<HTMLDivElement>) {
		if (modalRef.current && e.target === e.currentTarget) {
			props.onClose?.();
		}
	}

	useTriggerOnKeydown('Escape', props.onClose);

	useEffect(() => {
		modalRef.current = document.querySelector('#modal');

		if (modalRef.current?.hasChildNodes()) {
			document.documentElement.classList.add('prevent-scroll');
		}

		setMounted(true);

		return () => {
			document.documentElement.classList.remove('prevent-scroll');
		};
	}, [modalStoreSnap.otc]);

	if (!modalRef.current || !mounted) return null;

	return createPortal(
		<div
			aria-hidden={false}
			className={styles['backdrop']}
			onClick={handleBackdropClick}
		>
			<div
				aria-modal={true}
				className={classNames(styles['modal'], props.className, styles[`modal--${props.size}`])}
				role="dialog"
			>
				{props.children}
			</div>
		</div>,
		modalRef.current
	);
};

export default Modal;