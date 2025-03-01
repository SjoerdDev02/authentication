'use client';

import { IconUserCheck } from "@tabler/icons-react";
import classNames from "classnames";
import { useState } from "react";

import { deleteUser, updateUser } from "@/app/actions/authentication";
import styles from '@/components/authentication/update/UpdateForm.module.scss';
import Button from "@/components/common/buttons/Button";
import { useTranslationsContext } from "@/stores/translationsStore";
import userStore, { User } from "@/stores/userStore";
import { Defined } from "@/types/helpers";
import { useUpdateUser } from "@/utils/hooks/updateUser";

import { Flex } from "../../common/Flex";
import TextInput from "../../common/input/text/TextInput";
import AuthFormHeader from "../wrappers/AuthFormHeader";
import AuthFormInput from "../wrappers/AuthFormInput";
import AuthFormWrapper from "../wrappers/AuthFormWrapper";

type UpdateFormProps = {
	user: Defined<User>
}

const UpdateForm = (props: UpdateFormProps) => {
	const getTranslation = useTranslationsContext();

	const {
		user,
		resetUser,
		hasChanges,
		updateErrors,
		hasUpdateErrors,
		updateName,
		updatePhone,
		updateEmail,
		updatePassword
	} = useUpdateUser(props.user);

	const [isPending, setIsPending] = useState(false);
	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const handleUpdateUser = async () => {
		setIsPending(true);

		const result = await updateUser(user);

		setIsError(!result.success);
		setMessage(result.message);

		setIsPending(false);

		if (result.success) {
			if (result.data) {
				userStore.user = result.data;
			}

			resetUser();
		}
	};

	const handleDeleteUser = async () => {
		setIsPending(true);

		const result = await deleteUser();

		setIsError(!result.success);
		setMessage(result.message);

		setIsPending(false);

		if (result.success) {
			resetUser();
		}
	};

	const FormHeader = (
		<AuthFormHeader
			icon={IconUserCheck}
			label="Account settings"
		/>
	);

	const nameInput = [{
		label: 'Name',
		element: (
			<TextInput
				dataTest="update-name-input"
				onChange={(e) => updateName(e)}
				placeholder={getTranslation('Authentication.namePlaceholder')}
				type="text"
				value={user.name}
			/>
		)
	}];

	const phoneInput = [{
		label: 'Phone number',
		element: (
			<TextInput
				dataTest="update-phone-input"
				onChange={(e) => updatePhone(e)}
				placeholder={"Phone number"}
				type="phone"
				value={user.phone}
			/>
		)
	}];

	const emailInputs = [
		{
			label: 'New email',
			element: (
				<TextInput
					dataTest="update-email-input"
					onChange={(e) => updateEmail(e, user.confirmEmail)}
					placeholder={getTranslation('Authentication.emailPlaceholder')}
					type="email"
					value={user.email}
				/>
			)
		},
		{
			label: 'Confirm email',
			element: (
				<TextInput
					dataTest="update-email-confirm-input"
					onChange={(e) => updateEmail(user.email, e)}
					placeholder={'Confirm email'}
					type="email"
					value={user.confirmEmail || null}
				/>
			)
		}
	];

	const passwordInputs = [
		{
			label: 'New password',
			element: (
				<TextInput
					dataTest="update-password-input"
					onChange={(e) => updatePassword(e, user.confirmPassword)}
					placeholder={getTranslation('Authentication.passwordPlaceholder')}
					type="password"
					value={user.newPassword || null}
				/>
			)
		},
		{
			label: 'Confirm password',
			element: (
				<TextInput
					dataTest="update-password-confirm-input"
					onChange={(e) => updatePassword(user.newPassword, e)}
					placeholder={getTranslation('Authentication.passwordConfirmPlaceholder')}
					type="password"
					value={user.confirmPassword || null}
				/>
			)
		}
	];

	const submitDisabled = isPending || !hasChanges || hasUpdateErrors;

	return (
		<Flex
			className={styles['update-user']}
			flexDirection="column"
			gap={8}
		>
			<Flex
				flexDirection="column"
				gap={2}
			>
				<AuthFormWrapper header={FormHeader}>
					<Flex
						className={styles['update-user__input-wrapper']}
						flexDirection="column"
						gap={5}
					>
						<hr />

						<Flex gap={4}>
							<AuthFormInput
								error={updateErrors.name}
								header="Full name"
								inputElements={nameInput}
							/>

							<AuthFormInput
								dataTest="update-phone-input-wrapper"
								error={updateErrors.phone}
								header="Phone number"
								inputElements={phoneInput}
							/>
						</Flex>

						<hr />

						<AuthFormInput
							dataTest="update-email-inputs-wrapper"
							error={updateErrors.email}
							header="Email address"
							inputElements={emailInputs}
						/>

						<hr />

						<AuthFormInput
							dataTest="update-password-inputs-wrapper"
							error={updateErrors.password}
							header="Password"
							inputElements={passwordInputs}
						/>

						<hr />
					</Flex>

					<Button
						color="primary"
						disabled={submitDisabled}
						loading={isPending}
						onClick={handleUpdateUser}
						type="submit"
					>
						<span>
							{getTranslation('Authentication.updateLabel')}
						</span>
					</Button>

					<Button
						color="error"
						dataTest="delete-button"
						onClick={handleDeleteUser}
					>
						<span>
							{getTranslation('Authentication.deleteLabel')}
						</span>
					</Button>

					{!!message && (
						<div
							className={classNames('label', `label--${isError ? 'medium-error' : 'medium-success'}`)}
							data-error={isError}
							data-test="update-message"
						>
							{message}
						</div>
					)}
				</AuthFormWrapper>

			</Flex>
		</Flex>
	);
};

export default UpdateForm;

