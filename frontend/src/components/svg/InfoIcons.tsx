type InfoIconProps = {
	className?: string;
}

export const OpenInfoIcon = (props: InfoIconProps) => {
	return (
		<svg  className={`${props.className} icon icon-tabler icons-tabler-outline icon-tabler-info-circle`}  fill="none"  height="24"  stroke="currentColor"  strokeLinecap="round"  strokeLinejoin="round"  strokeWidth="2"  viewBox="0 0 24 24"  width="24"  xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none" stroke="none"/>
			<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />

			<path d="M12 9h.01" />

			<path d="M11 12h1v4h1" />
		</svg>
	);
};

export const FilledInfoIcon = (props: InfoIconProps) => {
	return (
		<svg  className={`${props.className} icon icon-tabler icons-tabler-filled icon-tabler-info-circle`}  fill="currentColor"  height="24"  viewBox="0 0 24 24"  width="24"  xmlns="http://www.w3.org/2000/svg">
			<path d="M0 0h24v24H0z" fill="none" stroke="none"/>

			<path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
		</svg>
	);
};