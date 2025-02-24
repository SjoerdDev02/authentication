'use client';

import { useSnapshot } from 'valtio';

import styles from '@/app/update/update.module.scss';
import UpdateForm from "@/components/authentication/update/UpdateForm";
import Page from '@/components/common/page/Page';
import userStore from '@/stores/userStore';

export default function Home() {
	const userStoreSnap = useSnapshot(userStore);

	return (
		<Page className={styles.page}>
			{userStoreSnap.user && (
				<UpdateForm user={userStoreSnap.user} />
			)}
		</Page>
	);
}
