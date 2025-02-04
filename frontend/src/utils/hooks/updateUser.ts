import { useMemo, useState } from "react";

import { User } from "@/stores/userStore";
import { Defined } from "@/types/helpers";

import { useHasChanges } from "./useHasChanges";

export type UpdateUser = User & {
	password?: string;
	confirmEmail?: string;
	confirmPassword?: string
}

export function useUpdateUser(initialUser: Defined<User>) {
	const [user, setUser] = useState<UpdateUser>(initialUser);

	const hasChanges = useHasChanges(initialUser, user);

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
			updateErrors.password = 'New email cannot be empty';
		} else if (!confirmEmail) {
			updateErrors.password = 'Confirm email cannot be empty';
		} else if (newEmail !== confirmEmail) {
			updateErrors.password = 'Emails do not match';
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
		} else if (!confirmPassword) {
			updateErrors.password = 'Confirm password cannot be empty';
		} else if (newPassword !== confirmPassword) {
			updateErrors.password = 'Passwords do not match';
		}
	}

	return {
		user,
		hasChanges,
		updateErrors,
		hasUpdateErrors,
		updateName,
		updatePhone,
		updateEmail,
		updatePassword
	};
}