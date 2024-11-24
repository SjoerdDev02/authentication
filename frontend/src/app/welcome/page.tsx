import Link from "next/link";

import Page from "@/components/common/page/Page";

import styles from "./page.module.scss";

export default function Welcome() {
	return (
		<Page className={styles.page}>
			<h1>Welcome!</h1>

			<Link href="/update">Update</Link>
		</Page>
	);
}
