import LoginForm from "@/components/authentication/login/LoginForm";
import Page from "@/components/common/page/Page";

import styles from "./page.module.scss";

export default function Home() {
	return (
		<Page className={styles.page}>
			<LoginForm />
		</Page>
	);
}
