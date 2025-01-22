import styles from '@/app/update/update.module.scss';
import UpdateForm from "@/components/authentication/update/UpdateForm";
import Page from '@/components/common/page/Page';

export default function Home() {
	return (
		<Page className={styles.page}>
			<UpdateForm />
		</Page>
	);
}
