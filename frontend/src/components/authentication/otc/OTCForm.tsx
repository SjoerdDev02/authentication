'use client';

import classNames from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { OTCService } from "@/app/services/otc-service";
import styles from '@/components/authentication/otc/OTCForm.module.scss';
import { OTCInput } from "@/components/authentication/otc/OTCInput";
import AuthFormWrapper from "@/components/authentication/wrappers/AuthFormWrapper";
import Button from "@/components/common/buttons/Button";
import { Flex } from "@/components/common/Flex";
import { pages } from "@/constants/routes";
import { useTranslationsContext } from "@/stores/translationsStore";
import { useSetUser, useUser } from "@/stores/userStore";

export const OTC_LENGTH = 6;

const OTCForm = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const getTranslation = useTranslationsContext();

	const otcService = new OTCService();

	const user = useUser();
	const setUser = useSetUser();

	const searchParamOtc = searchParams.get('otc');

	const initialOtc = searchParamOtc
		? searchParamOtc.split('')
		: Array.from({ length: OTC_LENGTH }).map(() => '');

	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const [otc, setOtc] = useState(initialOtc);

	const handleOtcUser = async () => {
		setIsPending(true);

		const otcString = otc.join('');

		const result = await otcService.otcUser(otcString);

		setIsError(!result.success);
		setMessage(result.message);

		setIsPending(false);

		if (result.success) {
			if (result.data) {
				setUser(result.data);
			}

			router.push(user?.name && user?.email
				? pages.Home.path
				: pages.Login.path
			);
		}
	};

	useEffect(() => {
		setIsError(false);
		setMessage(null);
	}, [otc]);

	return (
		<Flex
			alignItems="center"
			className={styles['otc-form']}
			flexDirection="column"
			gap={2}
		>
			<h1 className={styles['otc-form__header']}>{getTranslation('Authentication.otcHeader')}</h1>

			<h2 className={styles['otc-form__sub-header']}>{getTranslation('Authentication.otcSubHeader')}</h2>

			<AuthFormWrapper>
				<Flex
					gap={2}
					justifyContent="center"
				>
					<OTCInput
						onChange={(newOtc) => setOtc(newOtc)}
						otc={otc}
					/>
				</Flex>

				<Button
					color="primary"
					loading={isPending}
					onClick={handleOtcUser}
					type="submit"
				>
					<span>
						{getTranslation('Authentication.sendLabel')}
					</span>
				</Button>

				{!!message && (
					<div className={classNames('label', `label--${isError ? 'medium-error' : 'medium-success'}`)}>
						{message}
					</div>
				)}
			</AuthFormWrapper>
		</Flex>
	);
};

export default OTCForm;