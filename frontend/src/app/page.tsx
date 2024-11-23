import EntryForm from "@/components/authentication/EntryForm";
import { Flex } from "@/components/common/Flex";

import styles from "./page.module.css";

export default function Home() {
	return (
		<Flex alignItems="center"
			className={styles.page}
			justifyContent="center">
			<EntryForm />
		</Flex>
	);
}
