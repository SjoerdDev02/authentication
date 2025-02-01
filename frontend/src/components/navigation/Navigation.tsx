'use client';

import { IconDotsVertical, IconLanguage, IconMoonFilled, IconPasswordUser, IconSettings, IconSun } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSnapshot } from 'valtio';

import WrapperDropdown from '@/components/common/dropdowns/WrapperDropdown';
import styles from '@/components/navigation/Navigation.module.scss';
import { pages } from '@/constants/routes';
import userStore from '@/states/userStore';
import useLanguage from '@/utils/hooks/useLanguage';
import useTheme from '@/utils/hooks/useTheme';
import { LanguageType, ThemeType } from '@/utils/preferences/preferences';

import Logo from '../../../public/logo.svg';
import Button from '../common/buttons/Button';
import LinkDropdown from '../common/dropdowns/LinkDropdown';
import { Flex } from "../common/Flex";

type NavigationPropsType = {
	initialTheme: ThemeType;
	initialLanguage: LanguageType
}

const Navigation = (props: NavigationPropsType) => {
	const userStoreSnap = useSnapshot(userStore);
	const { theme, setTheme } = useTheme();
	const { language, setLanguage } = useLanguage();

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
			icon: IconSettings,
			href: pages.Update.path
		},
		{
			label: 'OTC',
			icon: IconPasswordUser,
			href: pages.Otc.path
		}
	];

	return (
		<Flex
			alignItems="center"
			className={styles.navigation}
			justifyContent="space-between"
			paddingBlock={4}
			paddingInline={6}
			tag="nav"
			width="fill"
		>
			<Link
				className={styles['navigation__logo']}
				href={pages.Home.path}
			>
				<Image
					alt="Logo"
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

				<div className={styles['navigation__divider']} />

				<LinkDropdown items={linkDropdownItems}>
					<Flex
						alignItems="center"
						className={styles['navigation__dropdown-toggle']}
						gap={1}
					>
						<span className="label label--bold-weight">
							{userStoreSnap.name || 'Sjoerd'}
						</span>

						<IconDotsVertical />
					</Flex>
				</LinkDropdown>
			</Flex>
		</Flex>
	);
};

export default Navigation;