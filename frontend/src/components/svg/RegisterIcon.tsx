import classNames from "classnames";

type RegisterIconProps = {
    className?: string;
}

const RegisterIcon = (props: RegisterIconProps) => {
	return (
		<svg
			className={classNames(props.className, 'icon icon-tabler icon-tabler-brand-zapier')}
			fill="none"
			height="34"
			viewBox="0 0 34 34"
			width="34"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1 17H11.6667M33 17H22.3333M17 1V11.6667M17 22.3333V33M5.68623 5.6862L13.2293 13.2293M28.3138 28.3137L20.7707 20.7706M28.3138 5.6862L20.7707 13.2293M13.2293 20.7706L5.68623 28.3137"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export default RegisterIcon;