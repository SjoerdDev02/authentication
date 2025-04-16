import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import React from 'react';
import { describe, expect, it } from 'vitest';

import { getOtcInputLocators } from '@/ci/components/OTCInput/OTCInputLocators';
import OTCInputWrapper from '@/ci/components/OTCInput/OTCInputWrapper';

describe('OTCInput component', () => {
	const INITIAL_MOCK_OTC = ['T', 'E', 'S', 'T', 'J', 'E'];
	const STRINGIFIED_INITIAL_MOCK_OTC = INITIAL_MOCK_OTC.join('');

	it("Should only allow letters and numbers", async () => {
		render(<OTCInputWrapper />);

		const { otcInput } = getOtcInputLocators(screen);
		const firstInput = otcInput[0];

		await userEvent.type(firstInput, "-");

		expect(firstInput).toHaveProperty('value', '');
	});

	it("Should should fill in the inputs when having an initial otc", async () => {
		render(<OTCInputWrapper initialOtc={INITIAL_MOCK_OTC} />);

		const { otcInput } = getOtcInputLocators(screen);
		const firstInput = otcInput[0];
		const lastInput = otcInput.at(-1);

		expect(firstInput).toHaveProperty('value', INITIAL_MOCK_OTC[0]);
		expect(lastInput).toHaveProperty('value', INITIAL_MOCK_OTC.at(-1));
	});

	it("Should paste a valid string as otc", async () => {
		render(<OTCInputWrapper />);

		const { otcInput } = getOtcInputLocators(screen);
		const firstInput = otcInput[0];
		const lastInput = otcInput[5];

		userEvent.paste(STRINGIFIED_INITIAL_MOCK_OTC);

		expect(firstInput).toHaveProperty('value', INITIAL_MOCK_OTC.at(0));
		expect(lastInput).toHaveProperty('value', INITIAL_MOCK_OTC.at(-1));
	});

	it("Should filter out invalid characters when pasting", async () => {
		render(<OTCInputWrapper />);

		const { otcInput } = getOtcInputLocators(screen);
		const firstInput = otcInput[0];
		const lastInput = otcInput[5];

		userEvent.paste('T*-+[>');

		expect(firstInput).toHaveProperty('value', INITIAL_MOCK_OTC.at(0));
		expect(lastInput).toHaveProperty('value', '');
	});

	it("Should start at the active index when pasting", async () => {
		render(<OTCInputWrapper />);

		const { otcInput } = getOtcInputLocators(screen);
		const firstInput = otcInput[0];
		const secondInput = otcInput[1];
		const lastInput = otcInput[5];

		await userEvent.click(secondInput);
		await userEvent.paste(STRINGIFIED_INITIAL_MOCK_OTC);

		expect(firstInput).toHaveProperty('value', '');
		expect(secondInput).toHaveProperty('value', INITIAL_MOCK_OTC[0]);
		expect(lastInput).toHaveProperty('value', INITIAL_MOCK_OTC.at(-2));
	});

	it("Should convert lowercase letters to uppercase letters", async () => {
		render(<OTCInputWrapper />);

		const { otcInput } = getOtcInputLocators(screen);
		const firstInput = otcInput[0];

		await userEvent.type(firstInput, "a");

		expect(firstInput).toHaveProperty('value', 'A');
	});

	it("Should should automatically focus the next character when a character is typed", async () => {
		render(<OTCInputWrapper />);

		const { otcInput } = getOtcInputLocators(screen);
		const firstInput = otcInput[0];
		const secondInput = otcInput[1];

		await userEvent.type(firstInput, "a");

		expect(document.activeElement).toBe(secondInput);
	});

	it("Should should automatically focus the previous character when a character is removed with Backspace", async () => {
		render(<OTCInputWrapper initialOtc={INITIAL_MOCK_OTC} />);

		const { otcInput } = getOtcInputLocators(screen);
		const firstInput = otcInput[0];
		const secondInput = otcInput[1];

		await userEvent.click(secondInput);
		fireEvent.keyDown(secondInput, { key: 'Backspace', code: 'Backspace' });

		expect(document.activeElement).toBe(firstInput);
		expect(firstInput).toHaveProperty('value', INITIAL_MOCK_OTC.at(0));
		expect(secondInput).toHaveProperty('value', '');
	});

	it("Should should automatically focus the previous character on ArrowLeft", async () => {
		render(<OTCInputWrapper initialOtc={INITIAL_MOCK_OTC} />);

		const { otcInput } = getOtcInputLocators(screen);
		const firstInput = otcInput[0];
		const secondInput = otcInput[1];

		await userEvent.click(secondInput);
		fireEvent.keyDown(secondInput, { key: 'ArrowLeft', code: 'ArrowLeft' });

		expect(document.activeElement).toBe(firstInput);
	});

	it("Should should automatically focus the previous character on ArrowRight", async () => {
		render(<OTCInputWrapper initialOtc={INITIAL_MOCK_OTC} />);

		const { otcInput } = getOtcInputLocators(screen);
		const firstInput = otcInput[0];
		const secondInput = otcInput[1];

		await userEvent.click(firstInput);
		fireEvent.keyDown(firstInput, { key: 'ArrowRight', code: 'ArrowRight' });

		expect(document.activeElement).toBe(secondInput);
	});

	it("Should not allow to enter more than the amount of characters received from the otc prop", async () => {
		render(<OTCInputWrapper initialOtc={INITIAL_MOCK_OTC} />);

		const { otcInput } = getOtcInputLocators(screen);
		const lastInput = otcInput[5];

		await userEvent.type(lastInput, 'k');

		expect(lastInput).toHaveProperty('value', INITIAL_MOCK_OTC.at(-1));
	});
});