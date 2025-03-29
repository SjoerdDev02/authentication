'use client';

import styles from '@/app/update/update.module.scss';
import UpdateForm from "@/components/authentication/update/UpdateForm";
import Page from '@/components/common/page/Page';
import { useUser } from '@/stores/userStore';

export default function Home() {
	const user = useUser();

	return (
		<Page className={styles.page}>
			{!!user && (
				<UpdateForm user={user} />
			)}
		</Page>
	);
}
