import classNames from "classnames";

type LoginIconProps = {
	className?: string;
}

const LoginIcon = (props: LoginIconProps) => {
	return (
		<svg
			className={classNames(props.className, 'icon icon-tabler icon-tabler-brand-intertia')}
			fill="none"
			height="17"
			viewBox="0 0 34 17"
			width="34"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M17.4571 1L24.7714 8.31429L17.4571 15.6286H25.6857L33 8.31429L25.6857 1H17.4571Z"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M1 1L8.31429 8.31429L1 15.6286H9.22857L16.5429 8.31429L9.22857 1H1Z"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export default LoginIcon;