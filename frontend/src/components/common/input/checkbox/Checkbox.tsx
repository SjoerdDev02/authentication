import styles from './Checkbox.module.scss';

type CheckboxPropsType = {
	onChange: () => void;
	checked: boolean;
}

const Checkbox = (props: CheckboxPropsType) => {
	return (
		<input
			checked={props.checked}
			className={styles.checkbox}
			onChange={props.onChange}
			type="checkbox"
		/>
	);
};

export default Checkbox;