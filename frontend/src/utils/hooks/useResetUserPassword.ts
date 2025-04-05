import { useMemo, useState } from "react";

import { getEmailFeedbackMessage, getPasswordFeedbackMessage, isValidEmail, isValidPassword } from "@/utils/regex";

export type PasswordResetUser = {
    email: string;
	newPassword: string;
	confirmPassword: string;
}

export function useResetUserPassword() {
	const initialUser = {
		email: '',
		newPassword: '',
		confirmPassword: ''
	};

	const [user, setUser] = useState<PasswordResetUser>(initialUser);

	const resetUser = () => {
		setUser(initialUser);
	};

	const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({
		email: null,
		password: null,
	});

	const hasUpdateErrors = useMemo(() => {
		return Object.values(fieldErrors).some(error => error !== null);
	}, [fieldErrors]);

	const isMissingRequiredFields = useMemo(() => {
		return !user.email && (!user.newPassword || !user.confirmPassword);
	}, [user]);

	function updateEmail(email: string) {
		const newUser = {
			...user,
			email,
		};

		setUser(newUser);

		let errorMessage = null;

		if (!email) {
			errorMessage = 'New email cannot be empty';
		} else if (!isValidEmail(email)) {
			errorMessage = getEmailFeedbackMessage(email);
		}

		setFieldErrors((prev) => ({
			...prev,
			email: errorMessage
		}));
	}

	function updatePassword(newPassword: string, confirmPassword: string) {
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

		setFieldErrors((prev) => ({
			...prev,
			password: errorMessage
		}));
	}

	return {
		user,
		resetUser,
		fieldErrors,
		hasUpdateErrors,
		isMissingRequiredFields,
		updateEmail,
		updatePassword
	};
}