import classNames from "classnames";

type CloseIconProps = {
	className?: string;
}

const CloseIcon = (props: CloseIconProps) => {
	return (
		<svg  className={classNames(props.className, 'icon icon-tabler icons-tabler-outline icon-tabler-square-x')}
			fill="none"
			height="24"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg">
			<path d="M0 0h24v24H0z"
				fill="none"
				stroke="none"/>
			<path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z" />
			<path d="M9 9l6 6m0 -6l-6 6" />
		</svg>
	);
};

export default CloseIcon;