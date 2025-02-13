'use client';

import { IconLock } from "@tabler/icons-react";
// import classNames from "classnames";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

// import { requestResetPasswordToken, resetPasswordUnprotected } from "@/app/actions/authentication";
import styles from '@/components/authentication/password-reset/PasswordResetForm.module.scss';
import Button from "@/components/common/buttons/Button";
import { Flex } from "@/components/common/Flex";
import TextInput from "@/components/common/input/text/TextInput";
// import { initialAuthFormState } from "@/constants/auth";
import { pages } from "@/constants/routes";
import { useTranslationsContext } from "@/stores/translationsStore";

import AuthFormFooter from "../wrappers/AuthFormFooter";
import AuthFormHeader from "../wrappers/AuthFormHeader";
import AuthFormWrapper from "../wrappers/AuthFormWrapper";

const PasswordResetForm = () => {
	const getTranslation = useTranslationsContext();
	// const router = useRouter();
	const searchParams = useSearchParams();

	const passwordResetToken = searchParams.get("password-reset-token");

	const [email, setEmail] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleRequestPasswordToken = async () => {
		// const result = await requestResetPasswordToken(prevState, formData);

		// return result;
	};

	const handleResetPassword = async () => {
		// const result = await resetPasswordUnprotected(prevState, formData, passwordResetToken);

		// if (result.success) {
		// 	router.push(pages.Login.path);
		// }

		// return result;
	};

	// const [state, formAction, isPending] = useActionState(
	// 	passwordResetToken ? handleResetPassword : handleRequestPasswordToken,
	// 	initialAuthFormState
	// );

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

	return (
		<Flex
			className={styles['password-reset-form']}
			flexDirection="column"
			gap={5}
		>
			<AuthFormWrapper
				// action={formAction}
				footer={FormFooter}
				header={FormHeader}
			>
				{passwordResetToken ? (
					<Flex
						flexDirection="column"
						gap={3}
					>
						<TextInput
							name="newPassword"
							onChange={(e) => setNewPassword(e)}
							placeholder={getTranslation('Authentication.passwordPlaceholder')}
							type="password"
							value={newPassword}
						/>

						<TextInput
							name="newPasswordConfirmation"
							onChange={(e) => setConfirmPassword(e)}
							placeholder={getTranslation('Authentication.passwordConfirmPlaceholder')}
							type="password"
							value={confirmPassword}
						/>
					</Flex>
				) : (
					<TextInput
						name="email"
						onChange={(e) => setEmail(e)}
						placeholder={getTranslation('Authentication.emailPlaceholder')}
						type="email"
						value={email}
					/>
				)}

				{/* {state.message && (
					<div className={classNames('label', `label--${state.success ? 'medium-success' : 'medium-error'}`)}>
						{state.message}
					</div>
				)} */}

				<Button
					color="primary"
					onClick={passwordResetToken ? handleResetPassword : handleRequestPasswordToken}
					// Pending here
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