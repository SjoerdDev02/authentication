import { useMemo, useRef, useState } from "react";

import { User } from "@/stores/userStore";
import { Defined } from "@/types/helpers";

import { getEmailFeedbackMessage, getPasswordFeedbackMessage, getPhoneNumberFeedbackMessage, isValidEmail, isValidPassword, isValidPhoneNumber } from "../regex";
import { useHasChanges } from "./useHasChanges";

export type UpdateUser = User & {
	password?: string;
	confirmEmail?: string;
	confirmPassword?: string
}

export function useUpdateUser(initialUser: Defined<User>) {
	const initialUserRef = useRef(initialUser);
	const [user, setUser] = useState<UpdateUser>(initialUser);

	const resetUser = () => {
		// eslint-disable-next-line no-unused-vars
		const { password, confirmEmail, confirmPassword, ...baseUser } = user;

		initialUserRef.current = baseUser;
		setUser(baseUser);
	};

	const hasChanges = useHasChanges(initialUserRef.current, user);

	const updateErrors: Record<string, string | null> = useMemo(() => {
		return {
			name: null,
			phone: null,
			email: null,
			password: null,
		};
	}, []);

	const hasUpdateErrors = useMemo(() => {
		return Object.values(updateErrors).some(error => error !== null);
	}, [updateErrors]);

	function updateName(newName: string) {
		const newUser = {
			...user,
			name: newName
		};

		setUser(newUser);

		if (!newName) {
			updateErrors.name = 'Name cannot be empty';
		} else {
			updateErrors.name = null;
		}
	}

	function updatePhone(newPhone: string) {
		const newUser = {
			...user,
			phone: newPhone
		};

		setUser(newUser);

		if (!newPhone) {
			updateErrors.phone = 'Phone number cannot be empty';
		} else if (!isValidPhoneNumber(newPhone)) {
			updateErrors.phone = getPhoneNumberFeedbackMessage(newPhone);
		} else {
			updateErrors.phone = null;
		}
	}

	function updateEmail(newEmail: string, confirmEmail?: string) {
		const newUser = {
			...user,
			email: newEmail,
			confirmEmail
		};

		setUser(newUser);

		if (!newEmail) {
			updateErrors.email = 'New email cannot be empty';
		} else if (!isValidEmail(newEmail)) {
			updateErrors.email = getEmailFeedbackMessage(newEmail);
		} else if (!confirmEmail) {
			updateErrors.email = 'Confirm email cannot be empty';
		} else if (newEmail !== confirmEmail) {
			updateErrors.email = 'Emails do not match';
		} else {
			updateErrors.email = null;
		}
	}

	function updatePassword(newPassword?: string, confirmPassword?: string) {
		const newUser = {
			...user,
			newPassword,
			confirmPassword
		};

		setUser(newUser);

		if (!newPassword) {
			updateErrors.password = 'New password cannot be empty';
		} else if (!isValidPassword(newPassword)) {
			updateErrors.password = getPasswordFeedbackMessage(newPassword);
		} else if (!confirmPassword) {
			updateErrors.password = 'Confirm password cannot be empty';
		} else if (newPassword !== confirmPassword) {
			updateErrors.password = 'Passwords do not match';
		} else {
			updateErrors.password = null;
		}
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