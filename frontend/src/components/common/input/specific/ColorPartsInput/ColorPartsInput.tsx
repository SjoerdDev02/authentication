import { useSnapshot } from 'valtio';

import { Flex } from '@/components/common/Flex';
import colorStore from '@/state/colorStore';
import formatStore from '@/state/formatStore';
import { HEXValuesType, HSLValuesType, RGBValuesType } from '@/types/ColorTypes';
import ColorFormatComposer from '@/utils/ColorFormatComposer';

import styles from './ColorPartsInput.module.scss';

const ColorPartsInput = () => {
	const colorStoreSnap = useSnapshot(colorStore);
	const formatStoreSnap = useSnapshot(formatStore);

	function handleUpdatePrimaryColorHSLValues(
		existingValues: HSLValuesType | RGBValuesType | HEXValuesType,
		newValue: {
			key: keyof HSLValuesType | keyof RGBValuesType | keyof HEXValuesType;
			value: string
		}
	) {
		const updatedValues = {
		  ...existingValues,
		  [newValue.key]: newValue.value,
		};

		const updateColorFormatComposer = new ColorFormatComposer({
			format: formatStoreSnap.format,
			parts: updatedValues
		});

		const HSLValues = updateColorFormatComposer.getHSLParts();

		colorStore.hue = HSLValues.hue;
		colorStore.saturation = HSLValues.saturation;
		colorStore.lightness = HSLValues.lightness;
	}

	const prefixLabel = formatStoreSnap.format === 'HSL'
		? 'hsl('
		: (formatStore.format === 'RGB'
			? 'rgb('
			: '#'
		);

	const colorFormatComposer = new ColorFormatComposer({
		format: 'HSL',
		parts: colorStoreSnap
	});

	const colorValuesInCurrentFormat = colorFormatComposer.getFormattedColor(
		formatStoreSnap.format,
		false
	);

	const currentValuesInCurrentFormatArray = Object.entries(colorValuesInCurrentFormat) as [keyof HSLValuesType | keyof RGBValuesType, number][];

	return (
		<Flex
			alignItems="center"
			className={`
                ${styles['color-parts-input']} 
                ${formatStore.format === 'HEX' && styles['color-parts-input--hex-format']}
            `}
			width="fill"
		>
			<span className={`
                ${styles['color-parts-input__label']}
                label label--small label--light-grayscale`
			}>
				{prefixLabel}
			</span>

			<input
				className={styles['color-parts-input__input']}
				onChange={(event) => {
					handleUpdatePrimaryColorHSLValues(
						colorValuesInCurrentFormat,
						{ key: currentValuesInCurrentFormatArray[0][0], value: event.target.value }
					);
				}}
				type="text"
				value={currentValuesInCurrentFormatArray[0][1]}
			/>

			<input
				className={styles['color-parts-input__input']}
				onChange={(event) => {
					handleUpdatePrimaryColorHSLValues(
						colorValuesInCurrentFormat,
						{ key: currentValuesInCurrentFormatArray[1][0], value: event.target.value }
					);
				}}
				type="text"
				value={currentValuesInCurrentFormatArray[1][1]}
			/>

			<input
				className={styles['color-parts-input__input']}
				onChange={(event) => {
					handleUpdatePrimaryColorHSLValues(
						colorValuesInCurrentFormat,
						{ key: currentValuesInCurrentFormatArray[2][0], value: event.target.value }
					);
				}}
				type="text"
				value={currentValuesInCurrentFormatArray[2][1]}
			/>

			{formatStore.format !== 'HEX' && (
				<span className={`
                    ${styles['color-parts-input__label']}
                    label label--small label--light-grayscale
                `}>
                )
				</span>
			)}
		</Flex>
	);
};

export default ColorPartsInput;