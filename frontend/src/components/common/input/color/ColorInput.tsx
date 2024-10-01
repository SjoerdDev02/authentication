import { ChangeEvent } from 'react';
import { useSnapshot } from 'valtio';

import colorStore from '@/state/colorStore';
import ColorFormatComposer from '@/utils/ColorFormatComposer';

import styles from './ColorInput.module.scss';

const ColorInput = () => {
	// TODO: Find a way to close the color picker on outside click on Firefox
	const colorStoreSnap = useSnapshot(colorStore);

	function handleUpdatePrimaryColorHSLValues(e: ChangeEvent<HTMLInputElement>) {
		const updateColorFormatComposer = new ColorFormatComposer(e.target.value);

		const HSLValues = updateColorFormatComposer.getHSLParts();

		colorStore.hue = HSLValues.hue;
		colorStore.saturation = HSLValues.saturation;
		colorStore.lightness = HSLValues.lightness;
	}

	const colorFormatComposer = new ColorFormatComposer({
		format: 'HSL',
		parts: colorStoreSnap
	});

	const currentColorHEXString = colorFormatComposer.getHEXString();

	return (
		<input
			className={styles['color-input']}
			onChange={handleUpdatePrimaryColorHSLValues}
			type="color"
			value={currentColorHEXString}
		/>
	);
};

export default ColorInput;