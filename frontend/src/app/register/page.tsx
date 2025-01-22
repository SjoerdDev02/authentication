import RegisterForm from "@/components/authentication/register/RegisterForm";
import Page from "@/components/common/page/Page";

import styles from "./page.module.scss";

export default function Home() {
	return (
		<Page className={styles.page}>
			<RegisterForm />
		</Page>
	);
}
