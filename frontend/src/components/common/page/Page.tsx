import classNames from 'classnames';
import { ReactNode } from 'react';

import styles from '@/components/common/page/Page.module.scss';

type PageProps = {
    children: ReactNode;
    className?: string;
	dataTest?: string;
}

const Page = (props: PageProps) => {
	return (
		<div
			className={classNames(styles['page'], props.className)}
			data-test={props.dataTest}
		>
			{props.children}
		</div>
	);
};

export default Page;