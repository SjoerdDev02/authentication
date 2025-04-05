import styles from "@/app/register/page.module.scss";
import RegisterForm from "@/components/authentication/register/RegisterForm";
import Page from "@/components/common/page/Page";

export default function Home() {
	return (
		<Page className={styles.page}>
			<RegisterForm />
		</Page>
	);
}
