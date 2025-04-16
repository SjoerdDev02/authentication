import { type screen } from "@testing-library/react";

export const getOtcInputLocators = (testScreen: typeof screen) => {
	const otcInput = testScreen.getAllByTestId('otc-input');

	return {
		otcInput
	};
};