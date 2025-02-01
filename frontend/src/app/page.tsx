import Page from "@/components/common/page/Page";

import styles from "./page.module.scss";

export default function Welcome() {
	return (
		<Page className={styles.page}>
			<h1 className={styles['page__header']}>
				Welcome!
			</h1>
		</Page>
	);
}
