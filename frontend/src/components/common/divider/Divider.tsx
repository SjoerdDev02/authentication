import styles from './Divider.module.scss';

type DividerProps = {
	color: 'primary' | 'secondary' | 'grayscale';
};

const Divider = (props: DividerProps) => {
	const dividerStyles = {
		backgroundColor: `var(--color-${props.color}-500)`,
	};

	return <hr className={styles.divider}
		style={dividerStyles} />;
};

export default Divider;
