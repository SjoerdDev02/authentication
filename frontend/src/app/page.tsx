import styles from "@/app/page.module.scss";
import Page from "@/components/common/page/Page";

export default function Welcome() {
	return (
		<Page className={styles.page}>
			<h1 className={styles['page__header']}>
				Welcome!
			</h1>
		</Page>
	);
}
