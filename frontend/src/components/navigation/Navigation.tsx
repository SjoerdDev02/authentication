'use client';

import { IconDotsVertical, IconLanguage, IconMoonFilled, IconPasswordUser, IconSettings, IconSun } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/common/buttons/Button';
import WrapperDropdown, { WrapperDropdownItemType } from '@/components/common/dropdowns/WrapperDropdown';
import { Flex } from "@/components/common/Flex";
import LogoutButton from '@/components/navigation/logout/LogoutButton';
import styles from '@/components/navigation/Navigation.module.scss';
import { pages } from '@/constants/routes';
import { useUser } from '@/stores/userStore';
import useLanguage from '@/utils/hooks/useLanguage';
import useTheme from '@/utils/hooks/useTheme';
import { LanguageType, ThemeType } from '@/utils/preferences/preferences';

const LinkDropdown = dynamic(() => import('../common/dropdowns/LinkDropdown'));

type NavigationPropsType = {
	initialTheme: ThemeType;
	initialLanguage: LanguageType
}

const Navigation = (props: NavigationPropsType) => {
	const user = useUser();

	const { theme, setTheme } = useTheme();
	const { language, setLanguage } = useLanguage();

	const languageItems = [
		{
			label: 'EN',
			value: 'EN'
		},
		{
			label: 'NL',
			value: 'NL'
		},
	] satisfies WrapperDropdownItemType<LanguageType>[];

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
					height={40}
					priority
					src="/logo.svg"
					width={40}
				/>
			</Link>

			<Flex
				alignItems="center"
				gap={5}
			>
				<Flex
					alignItems="center"
					gap={3}
				>
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

				{!!user && (
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
									{user.name}
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