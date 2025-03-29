'use client';

import { IconDotsVertical, IconLanguage, IconMoonFilled, IconPasswordUser, IconSettings, IconSun } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useSnapshot } from 'valtio';

import WrapperDropdown from '@/components/common/dropdowns/WrapperDropdown';
import styles from '@/components/navigation/Navigation.module.scss';
import { pages } from '@/constants/routes';
import userStore, { User } from '@/stores/userStore';
import useLanguage from '@/utils/hooks/useLanguage';
import useTheme from '@/utils/hooks/useTheme';
import { LanguageType, ThemeType } from '@/utils/preferences/preferences';

import Logo from '../../../public/logo.svg';
import Button from '../common/buttons/Button';
import { Flex } from "../common/Flex";
import LogoutButton from './logout/LogoutButton';

const LinkDropdown = dynamic(() => import('../common/dropdowns/LinkDropdown'));

type NavigationPropsType = {
	initialUser?: User;
	initialTheme: ThemeType;
	initialLanguage: LanguageType
}

const Navigation = (props: NavigationPropsType) => {
	const userStoreSnap = useSnapshot(userStore);
	const { theme, setTheme } = useTheme();
	const { language, setLanguage } = useLanguage();

	if (props.initialUser) {
		userStore.user = props.initialUser;
	}

	const languageItems = [
		{
			label: 'NL',
			value: 'NL'
		},
		{
			label: 'EN',
			value: 'EN'
		},
		{
			label: 'FR',
			value: 'FR'
		},
		{
			label: 'DE',
			value: 'DE'
		},
		{
			label: 'ES',
			value: 'ES'
		}
	];

	const linkDropdownItems = [
		{
			label: 'Settings',
			dataTest: 'settings-option',
			icon: IconSettings,
			href: pages.Update.path
		},
		{
			label: 'OTC',
			dataTest: 'otc-option',
			icon: IconPasswordUser,
			href: pages.Otc.path
		}
	];

	return (
		<Flex
			alignItems="center"
			className={styles.navigation}
			dataTest="navbar"
			justifyContent="space-between"
			paddingBlock={4}
			paddingInline={6}
			tag="nav"
			width="fill"
		>
			<Link
				className={styles['navigation__logo']}
				data-test="navbar-logo"
				href={pages.Home.path}
				prefetch={false}
			>
				<Image
					alt="Logo"
					priority
					src={Logo}
				/>
			</Link>

			<Flex
				alignItems="center"
				gap={5}
			>
				<Flex alignItems="center"
					gap={3}>
					<WrapperDropdown
						activeValue={language}
						items={languageItems}
						onChangeValue={(language) => setLanguage(language)}
					>
						<IconLanguage />
					</WrapperDropdown>

					{(props.initialTheme === 'dark' && !theme) || theme === 'dark' ? (
						<Button
							color="blank"
							onClick={() => setTheme('light')}
						>
							<IconMoonFilled />
						</Button>
					) : (
						<Button
							color="blank"
							onClick={() => setTheme('dark')}
						>
							<IconSun />
						</Button>
					)}
				</Flex>

				{userStoreSnap.user && (
					<>
						<div className={styles['navigation__divider']} />

						<LinkDropdown
							items={linkDropdownItems}
							listAddition={<LogoutButton />}
						>
							<Flex
								alignItems="center"
								className={styles['navigation__dropdown-toggle']}
								gap={1}
							>
								<span className="label label--bold-weight">
									{userStoreSnap.user.name}
								</span>

								<IconDotsVertical />
							</Flex>
						</LinkDropdown>
					</>
				)}
			</Flex>
		</Flex>
	);
};

export default Navigation;