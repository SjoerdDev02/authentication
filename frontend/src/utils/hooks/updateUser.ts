import { useMemo, useRef, useState } from "react";

import { Defined } from "@/types/helpers";
import { User } from "@/types/user";
import { useHasChanges } from "@/utils/hooks/useHasChanges";
import { getEmailFeedbackMessage, getPasswordFeedbackMessage, getPhoneNumberFeedbackMessage, isValidEmail, isValidPassword, isValidPhoneNumber } from "@/utils/regex";

export type UpdateUser = User & {
	newPassword?: string;
	confirmEmail?: string;
	confirmPassword?: string
}

export function useUpdateUser(initialUser: Defined<User>) {
	const initialUserRef = useRef(initialUser);
	const [user, setUser] = useState<UpdateUser>(initialUser);

	const resetUser = () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { newPassword, confirmEmail, confirmPassword, ...baseUser } = user;

		initialUserRef.current = baseUser;
		setUser(baseUser);
	};

	const hasChanges = useHasChanges(initialUserRef.current, user);

	const [updateErrors, setUpdateErrors] = useState<Record<string, string | null>>({
		name: null,
		phone: null,
		email: null,
		password: null,
	});

	const hasUpdateErrors = useMemo(() => {
		return Object.values(updateErrors).some(error => error !== null);
	}, [updateErrors]);

	function updateName(newName: string) {
		const newUser = {
			...user,
			name: newName
		};

		setUser(newUser);

		let errorMessage = null;

		if (!newName) {
			errorMessage = 'Name cannot be empty';
		}

		setUpdateErrors((prev) => ({
			...prev,
			name: errorMessage
		}));
	}

	function updatePhone(newPhone: string) {
		const newUser = {
			...user,
			phone: newPhone
		};

		setUser(newUser);

		let errorMessage = null;

		if (!newPhone) {
			errorMessage = 'Phone number cannot be empty';
		} else if (!isValidPhoneNumber(newPhone)) {
			errorMessage = getPhoneNumberFeedbackMessage(newPhone);
		} else {
			errorMessage = null;
		}

		setUpdateErrors((prev) => ({
			...prev,
			phone: errorMessage
		}));
	}

	function updateEmail(newEmail: string, confirmEmail?: string) {
		const newUser = {
			...user,
			email: newEmail,
			confirmEmail
		};

		setUser(newUser);

		let errorMessage = null;

		if (!newEmail) {
			errorMessage = 'New email cannot be empty';
		} else if (!isValidEmail(newEmail)) {
			errorMessage = getEmailFeedbackMessage(newEmail);
		} else if (!confirmEmail) {
			errorMessage = 'Confirm email cannot be empty';
		} else if (newEmail !== confirmEmail) {
			errorMessage = 'Emails do not match';
		}

		setUpdateErrors((prev) => ({
			...prev,
			email: errorMessage
		}));
	}

	function updatePassword(newPassword: string | undefined, confirmPassword: string | undefined) {
		const newUser = {
			...user,
			newPassword,
			confirmPassword
		};

		setUser(newUser);

		let errorMessage = null;

		if (!newPassword) {
			errorMessage = 'New password cannot be empty';
		} else if (!isValidPassword(newPassword)) {
			errorMessage = getPasswordFeedbackMessage(newPassword);
		} else if (!confirmPassword) {
			errorMessage = 'Confirm password cannot be empty';
		} else if (newPassword !== confirmPassword) {
			errorMessage = 'Passwords do not match';
		}

		setUpdateErrors((prev) => ({
			...prev,
			password: errorMessage
		}));
	}

	return {
		user,
		resetUser,
		hasChanges,
		updateErrors,
		hasUpdateErrors,
		updateName,
		updatePhone,
		updateEmail,
		updatePassword
	};
}