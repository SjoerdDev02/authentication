import Link from 'next/link';

import { Flex } from '@/components/common/Flex';

type AuthFormFooterProps = {
    label: string;
    linkText: string;
    linkHref: string;
}

const AuthFormFooter = (props: AuthFormFooterProps) => {
	return (
		<Flex
			alignItems="center"
			gap={1}
			justifyContent="center"
		>
			<span className="label label--dark-grayscale label--light-weight">
				{props.label}
			</span>

			<Link className="label label--dark-grayscale"
				href={props.linkHref}>
				{props.linkText}
			</Link>
		</Flex>
	);
};

export default AuthFormFooter;