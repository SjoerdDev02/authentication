import styles from "@/app/reset-password/page.module.scss";
import PasswordResetForm from "@/components/authentication/password-reset/PasswordResetForm";
import Page from "@/components/common/page/Page";

export default function Home() {
	return (
		<Page className={styles.page}>
			<PasswordResetForm />
		</Page>
	);
}
