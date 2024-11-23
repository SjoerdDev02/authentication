type ThemeIconsProps = {
	className?: string;
}

export const LightModeIcon = (props: ThemeIconsProps) => {
	return (
		<svg  className={`${props.className} icon icon-tabler icons-tabler-outline icon-tabler-moon`}
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
			<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
		</svg>
	);
};

export const DarkModeIcon = (props: ThemeIconsProps) => {
	return (
		<svg  className={`${props.className} icon icon-tabler icons-tabler-filled icon-tabler-moon`}
			fill="currentColor"
			height="24"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg">
			<path d="M0 0h24v24H0z"
				fill="none"
				stroke="none"/>
			<path d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z" />
		</svg>
	);
};