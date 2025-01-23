import PasswordResetForm from "@/components/authentication/password-reset/PasswordResetForm";
import Page from "@/components/common/page/Page";

import styles from "./page.module.scss";

export default function Home() {
	return (
		<Page className={styles.page}>
			<PasswordResetForm />
		</Page>
	);
}
