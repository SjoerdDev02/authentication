'use client';

import { IconLock } from "@tabler/icons-react";
import classNames from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { UserService } from "@/app/services/user-service";
import styles from '@/components/authentication/password-reset/PasswordResetForm.module.scss';
import Button from "@/components/common/buttons/Button";
import { Flex } from "@/components/common/Flex";
import TextInput from "@/components/common/input/text/TextInput";
import { pages } from "@/constants/routes";
import { useTranslationsContext } from "@/stores/translationsStore";
import { useResetUserPassword } from "@/utils/hooks/useResetUserPassword";

import AuthFormFooter from "../wrappers/AuthFormFooter";
import AuthFormHeader from "../wrappers/AuthFormHeader";
import AuthFormInput from "../wrappers/AuthFormInput";
import AuthFormWrapper from "../wrappers/AuthFormWrapper";

const PasswordResetForm = () => {
	const getTranslation = useTranslationsContext();
	const router = useRouter();
	const searchParams = useSearchParams();

	const userService = new UserService();

	const passwordResetToken = searchParams.get("password-reset-token");

	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const {
		user,
		resetUser,
		fieldErrors,
		hasUpdateErrors,
		isMissingRequiredFields,
		updateEmail,
		updatePassword
	} = useResetUserPassword();

	const handleRequestPasswordToken = async () => {
		setIsPending(true);

		const result = await userService.requestResetPasswordToken(user);

		setIsError(!result.success);
		setMessage(result.message);

		setIsPending(false);

		if (result.success) {
			resetUser();
		}
	};

	const handleResetPassword = async () => {
		setIsPending(true);

		const result = await userService.resetPasswordWithToken(user, passwordResetToken);

		setIsError(!result.success);
		setMessage(result.message);

		setIsPending(false);

		if (result.success) {
			router.push(pages.Login.path);
		}

		return result;
	};

	const FormHeader = (
		<AuthFormHeader
			icon={IconLock}
			label={getTranslation('Authentication.resetPassword')}
		/>
	);

	const FormFooter = (
		<AuthFormFooter
			label={getTranslation('Authentication.dontNeedToResetPassword')}
			linkHref={pages.Login.path}
			linkText={getTranslation('Authentication.signIn')}
		/>
	);

	const emailInput = [{
		label: 'New email',
		element: (
			<TextInput
				dataTest="password-reset-email-input"
				onChange={(e) => updateEmail(e)}
				placeholder={getTranslation('Authentication.emailPlaceholder')}
				type="email"
				value={user.email}
			/>
		)
	}];

	const passwordInputs = [
		{
			label: 'New password',
			element: (
				<TextInput
					dataTest="new-password-reset-input"
					onChange={(e) => updatePassword(e, user.confirmPassword)}
					placeholder={getTranslation('Authentication.passwordPlaceholder')}
					type="password"
					value={user.newPassword}
				/>
			)
		},
		{
			label: 'Confirm password',
			element: (
				<TextInput
					dataTest="confirm-password-reset-input"
					onChange={(e) => updatePassword(user.newPassword, e)}
					placeholder={getTranslation('Authentication.passwordConfirmPlaceholder')}
					type="password"
					value={user.confirmPassword}
				/>
			)
		}
	];

	useEffect(() => {
		if (!!user.email || !!user.newPassword || !!user.confirmPassword) {
			setIsError(false);
			setMessage(null);
		}
	}, [user]);

	const submitDisabled = isPending || isError || isMissingRequiredFields || hasUpdateErrors;

	return (
		<Flex
			className={styles['password-reset-form']}
			flexDirection="column"
			gap={5}
		>
			<AuthFormWrapper
				footer={FormFooter}
				header={FormHeader}
			>
				{passwordResetToken ? (
					<AuthFormInput
						error={fieldErrors.password}
						header="Password"
						inputElements={passwordInputs}
					/>
				) : (
					<AuthFormInput
						error={fieldErrors.email}
						header="Email address"
						inputElements={emailInput}
					/>
				)}

				{!!message && (
					<div
						className={classNames('label', `label--${isError ? 'medium-error' : 'medium-success'}`)}
						data-error={isError}
						data-test="password-reset-message"
					>
						{message}
					</div>
				)}

				<Button
					color="primary"
					disabled={submitDisabled}
					loading={isPending}
					onClick={passwordResetToken ? handleResetPassword : handleRequestPasswordToken}
					type="submit"
				>
					<span>
						{getTranslation('Authentication.resetLabel')}
					</span>
				</Button>
			</AuthFormWrapper>
		</Flex>
	);
};

export default PasswordResetForm;