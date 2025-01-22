import styles from '@/app/otc/[[...code]]/page.module.scss';
import OTCForm from '@/components/authentication/otc/OTCForm';
import Page from "@/components/common/page/Page";

export default function OTC() {
	return (
		<Page className={styles.page}>
			<OTCForm />
		</Page>
	);
}
