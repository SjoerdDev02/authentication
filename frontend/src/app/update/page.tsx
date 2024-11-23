import styles from '@/app/update/update.module.scss';
import UpdateForm from "@/components/authentication/UpdateForm";
import { Flex } from "@/components/common/Flex";

export default function Home() {
	return (
		<Flex
			alignItems="center"
			className={styles.page}
			justifyContent="center"
		>
			<UpdateForm />
		</Flex>
	);
}
