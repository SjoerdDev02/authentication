import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { logoutUser } from "@/app/actions/authentication";
import styles from '@/components/navigation/logout/LogoutButton.module.scss';
import { pages } from "@/constants/routes";
import { useTranslationsContext } from "@/stores/translationsStore";
import userStore from "@/stores/userStore";

const LogoutButton = () => {
	const getTranslation = useTranslationsContext();
	const router = useRouter();

	const [isPending, setIsPending] = useState(false);

	const handleLogoutUser = async () => {
		setIsPending(true);

		const result = await logoutUser();

		if (result.success) {
			userStore.user = null;

			router.push(pages.Login.path);
		}

		setIsPending(false);
	};

	return (
		<button
			className={styles['logout-button']}
			data-test="logout-option"
			disabled={isPending}
			onClick={handleLogoutUser}
		>
			<label className="label label--clickable">
				{getTranslation('Authentication.logout')}
			</label>

			<IconLogout />
		</button>
	);
};

export default LogoutButton;