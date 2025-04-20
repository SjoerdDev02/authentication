'use client';

import classNames from "classnames";
import Link from "next/link";

import styles from '@/app/not-found.module.scss';
import { Flex } from "@/components/common/Flex";
import Page from "@/components/common/page/Page";
import { pages } from "@/constants/routes";
import { useTranslationsContext } from "@/stores/translationsStore";

type ErrorPageProps = {
    error: Error;
}

export default function Error(props: ErrorPageProps) {
	const getTranslation = useTranslationsContext();

	console.error(props.error);

	return (
		<Page
			className={styles['not-found-page']}
			dataTest="not-found-page"
		>
			<Flex
				alignItems="flex-start"
				flexDirection="column"
				gap={9}
			>
				<Flex
					flexDirection="column"
					gap={2}
				>
					<h1 className={styles['not-found-page__header']}>{getTranslation('NotFound.header')}</h1>

					<h2 className="label label--big label--light-primary">{getTranslation('NotFound.subHeader')}</h2>
				</Flex>

				<Link
					className={classNames(styles['not-found-page__link'], 'label')}
					data-test="not-found-page-link"
					href={pages.Home.path}
					prefetch={false}
				>
                	{getTranslation('NotFound.cta')}
				</Link>
			</Flex>
		</Page>
	);
}