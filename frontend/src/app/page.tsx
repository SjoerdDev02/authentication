import { Flex } from "@/components/common/Flex";

import styles from "./page.module.css";

export default function Home() {
	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<Flex className={styles.flex} flexDirection="row-reverse" gap={8}>
					<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, laborum.</p>

					<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, laborum lorem</p>
				</Flex>
			</main>
			<footer className={styles.footer}>
				<h1>Footer</h1>
			</footer>
		</div>
	);
}
