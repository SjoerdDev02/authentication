'use client';

import { MouseEvent, useEffect, useRef, useState } from "react";
import { createPortal } from 'react-dom';
import { useSnapshot } from "valtio";

import FeedbackMessageForm from "@/components/FeedbackMessageForm";
import CloseIcon from "@/components/svg/CloseIcon";
import modalStore from "@/state/modalStore";
import { useTriggerOnKeydown } from "@/utils/hooks/useTriggerOnKeydown";

import Button from "../buttons/Button";
import { Flex } from "../Flex";
import styles from './FeedbackMessageModal.module.scss';

const FeedbackMessageModal = () => {
	const modalStoreSnap = useSnapshot(modalStore);

	const modalRef = useRef<Element | null>(null);

	const [mounted, setMounted] = useState(false);

	function handleClose() {
		modalStore.feedbackForm = false;
	}

	function handleBackdropClick(e: MouseEvent<HTMLDivElement>) {
		if (modalRef.current && e.target === e.currentTarget) {
			handleClose();
		}
	}

	useTriggerOnKeydown('Escape', handleClose);

	useEffect(() => {
		modalRef.current = document.querySelector('#modal');

		if (modalRef.current?.hasChildNodes()) {
			document.documentElement.classList.add('prevent-scroll');
		}

		setMounted(true);

		return () => {
			document.documentElement.classList.remove('prevent-scroll');
		};
	}, [modalStoreSnap.feedbackForm]);

	if (!modalRef.current || !mounted || !modalStoreSnap.feedbackForm) return null;

	return createPortal(
		<div
			aria-hidden={false}
			className={styles.backdrop}
			onClick={handleBackdropClick}
		>
			<div
				aria-modal={true}
				className={styles.modal}
				role="dialog"
			>
				<Flex gap={8} justifyContent="space-between">
					<h2 className="label label--big label--bold-weight">Send us a message</h2>

					<Button color="blank" onClick={handleClose}>
						<CloseIcon className={styles['modal__close-button']} />
					</Button>
				</Flex>

				<FeedbackMessageForm onClose={handleClose} />
			</div>
		</div>,
		modalRef.current
	);
};

export default FeedbackMessageModal;