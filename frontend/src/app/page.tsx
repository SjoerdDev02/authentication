import Link from "next/link";

import { Flex } from "@/components/common/Flex";
import Page from "@/components/common/page/Page";

import styles from "./page.module.scss";

export default function Welcome() {
	return (
		<Page className={styles.page}>
			<h1 className={styles['page__header']}>
				Welcome!
			</h1>

			<Flex gap={2}>
				<Link
					className="label"
					href="/update"
				>
						Update
				</Link>

				<Link
					className="label"
					href="/otc"
				>
						OTC
				</Link>
			</Flex>
		</Page>
	);
}
