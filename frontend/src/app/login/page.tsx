import styles from "@/app/login/page.module.scss";
import LoginForm from "@/components/authentication/login/LoginForm";
import Page from "@/components/common/page/Page";

export default function Home() {
	return (
		<Page className={styles.page}>
			<LoginForm />
		</Page>
	);
}
