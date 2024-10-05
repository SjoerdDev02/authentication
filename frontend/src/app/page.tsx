import EntryForm from "@/components/authentication/EntryForm";

import styles from "./page.module.css";

export default function Home() {
	return (
		<div className={styles.page}>
			<EntryForm />
		</div>
	);
}
