'use client'

import styles from '@/components/navigation/Navigation.module.scss';

import { Flex } from "../common/Flex";
import { LanguageType, ThemeType } from '@/utils/preferences/preferences';
import useTheme from '@/utils/hooks/useTheme';
import useLanguage from '@/utils/hooks/useLanguage';
import { DarkModeIcon, LightModeIcon } from '../svg/ThemeIcons';
import Button from '../common/buttons/Button';
import LanguageIcon from '../svg/LanguageIcon';
import Logo from '../../../public/logo.svg';
import Image from 'next/image';
import WrapperDropdown from '@/components/common/dropdowns/WrapperDropdown'

type NavigationPropsType = {
	initialTheme: ThemeType;
	initialLanguage: LanguageType
}

const Navigation = (props: NavigationPropsType) => {
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
			label: 'GE',
			value: 'GE'
		},
		{
			label: 'ES',
			value: 'ES'
		}
	];
	
	return (
<Flex
				alignItems="center"
				tag="nav"
				className={styles.navigation}
				justifyContent="space-between"
				paddingInline={6}
				paddingBlock={4}
				width="fill"
			>
				<Flex
					alignItems="center"
					gap={2}
				 	justifyContent="flex-start"
				 >
					<Image
						alt="Logo"
					 	src={Logo}
					  />
				</Flex>

				<Flex
					alignItems="center"
					gap={3}
				>
					<WrapperDropdown
						activeValue={language}
						items={languageItems}
						onChangeValue={(language) => setLanguage(language)}
					>
						<LanguageIcon className={styles['navigation__icon']} />
					</WrapperDropdown>

					{(props.initialTheme === 'dark' && !theme) || theme === 'dark' ? (
						<Button
							color="blank"
							onClick={() => setTheme('light')}
						>
							<DarkModeIcon className={styles['navigation__icon']} />
						</Button>
					) : (
						<Button
							color="blank"
							onClick={() => setTheme('dark')}
						>
							<LightModeIcon className={styles['navigation__icon']} />
						</Button>
					)}
					</Flex>
					</Flex>
	);
};

export default Navigation;