import { describe, expect, it } from "vitest";

import { getEmailFeedbackMessage, getPasswordFeedbackMessage, getPhoneNumberFeedbackMessage, isValidEmail, isValidPassword, isValidPhoneNumber } from '@/utils/regex';

describe('isValidEmail', () => {
	it('Name should contain 2 or more characters', () => {
		const email = 't@domain.com';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeFalsy();
	});

	it('Name should contain no more than 20 characters', () => {
		const email = '123456789123456789123@domain.com';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeFalsy();
	});

	it('Name should contain 2 or more characters', () => {
		const email = 'test.test@domain.com';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeTruthy();
	});

	it('Name should allow . inside the name', () => {
		const email = 'john.doe@domain.com';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeTruthy();
	});

	it('Name should allow - inside the name', () => {
		const email = 'john-doe@domain.com';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeTruthy();
	});

	it('Name should not allow + inside the name', () => {
		const email = 'john+doe@domain.com';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeFalsy();
	});

	it('Email should include an @', () => {
		const email = 'johndoe.domain.com';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeFalsy();
	});

	it('Domain name should contain 2 or more characters', () => {
		const email = 'john@d.com';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeFalsy();
	});

	it('Domain name should contain no more than 10 characters', () => {
		const email = 'john@averylongdomain.com';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeFalsy();
	});

	it('Domain name should contain only lowercase letters', () => {
		const email = 'john@Domain.com';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeFalsy();
	});

	it('Domain name should not allow -', () => {
		const email = 'john@do-main.com';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeFalsy();
	});

	it('Email should include a . after the domain name', () => {
		const email = 'john@domaincom';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeFalsy();
	});

	it('TLD should contain 2 or more characters', () => {
		const email = 'john@domain.c';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeFalsy();
	});

	it('TLD should contain no more than 5 characters', () => {
		const email = 'john@domain.commmmmm';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeFalsy();
	});

	it('TLD should contain only lowercase letters', () => {
		const email = 'john@domain.CoM';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeFalsy();
	});

	it('TLD should not allow -', () => {
		const email = 'john@domain.co-m';

		const emailIsValid = isValidEmail(email);

		expect(emailIsValid).toBeFalsy();
	});
});

describe('getEmailFeedbackMessage', () => {
	it('returns invalidEmailStart for invalid starting characters or length', () => {
		expect(getEmailFeedbackMessage('a@domain.com')).toBe('Authentication.Errors.invalidEmailStart');
		// expect(getEmailFeedbackMessage('thisnameiswaytoolongtobevalid@domain.com')).toBe('Authentication.Errors.invalidEmailStart');
	});

	it('returns missingAtSymbol if @ is missing', () => {
		expect(getEmailFeedbackMessage('username.domain.com')).toBe('Authentication.Errors.missingAtSymbol');
	});

	it('returns invalidDomainName for invalid or too short/long domain name', () => {
		expect(getEmailFeedbackMessage('user@D.com')).toBe('Authentication.Errors.invalidDomainName');
		// expect(getEmailFeedbackMessage('user@toolongdomainname.com')).toBe('Authentication.Errors.invalidDomainName');
		expect(getEmailFeedbackMessage('user@1.com')).toBe('Authentication.Errors.invalidDomainName');
	});

	it('returns missingOrInvalidTLD if TLD is missing or invalid', () => {
		expect(getEmailFeedbackMessage('user@domaincom')).toBe('Authentication.Errors.missingOrInvalidTLD');
		expect(getEmailFeedbackMessage('user@domain.c')).toBe('Authentication.Errors.missingOrInvalidTLD');
		expect(getEmailFeedbackMessage('user@domain.commmm')).toBe('Authentication.Errors.missingOrInvalidTLD');
	});

	it('returns invalidCharacters if special characters are present', () => {
		expect(getEmailFeedbackMessage('user+name@domain.com')).toBe('Authentication.Errors.invalidCharacters');
		expect(getEmailFeedbackMessage('user!name@domain.com')).toBe('Authentication.Errors.invalidCharacters');
	});

	it('returns empty string for valid email', () => {
		expect(getEmailFeedbackMessage('test.test@domain.com')).toBe('');
	});
});

describe('isValidPassword', () => {
	it('returns true for valid password', () => {
		expect(isValidPassword('Password1!')).toBe(true);
		expect(isValidPassword('StrongPass-1')).toBe(true);
	});

	it('returns false if too short', () => {
		expect(isValidPassword('P1!a')).toBe(false);
	});

	it('returns false if missing uppercase', () => {
		expect(isValidPassword('password1!')).toBe(false);
	});

	it('returns false if missing number', () => {
		expect(isValidPassword('Password!')).toBe(false);
	});

	it('returns false if missing special character', () => {
		expect(isValidPassword('Password1')).toBe(false);
	});

	it('returns false if invalid characters are included', () => {
		expect(isValidPassword('Password1*')).toBe(false);
		expect(isValidPassword('Password1!#')).toBe(false);
	});
});

describe('getPasswordFeedbackMessage', () => {
	it('returns passwordTooShort if length < 8', () => {
		expect(getPasswordFeedbackMessage('P1!a')).toBe('Authentication.Errors.passwordTooShort');
	});

	it('returns missingUppercase if no uppercase', () => {
		expect(getPasswordFeedbackMessage('password1!')).toBe('Authentication.Errors.missingUppercase');
	});

	it('returns missingNumber if no number', () => {
		expect(getPasswordFeedbackMessage('Password!')).toBe('Authentication.Errors.missingNumber');
	});

	it('returns missingSpecialCharacter if no - or !', () => {
		expect(getPasswordFeedbackMessage('Password1')).toBe('Authentication.Errors.missingSpecialCharacter');
	});

	it('returns invalidCharacters if invalid chars included', () => {
		expect(getPasswordFeedbackMessage('Password1!*')).toBe('Authentication.Errors.invalidCharacters');
	});

	it('returns empty string if password is valid', () => {
		expect(getPasswordFeedbackMessage('Password1!')).toBe('');
	});
});

describe('isValidPhoneNumber', () => {
	it('validates standard phone formats', () => {
		expect(isValidPhoneNumber('+1 123-456-7890')).toBe(true);
		expect(isValidPhoneNumber('1234567890')).toBe(true);
		expect(isValidPhoneNumber('+44 (20) 1234-5678')).toBe(true);
		expect(isValidPhoneNumber('001-234-567890')).toBe(true);
	});

	it('returns false for invalid formats', () => {
		expect(isValidPhoneNumber('123')).toBe(false);
		expect(isValidPhoneNumber('+123-abc-defg')).toBe(false);
		expect(isValidPhoneNumber('++1234567890')).toBe(false);
	});
});

describe('getPhoneNumberFeedbackMessage', () => {
	it('returns invalidPhoneCountryCode if country code is invalid', () => {
		expect(getPhoneNumberFeedbackMessage('++1234567890')).toBe('Authentication.Errors.invalidPhoneCountryCode');
	});

	it('returns invalidPhoneLength if total digits < 10', () => {
		expect(getPhoneNumberFeedbackMessage('+1 123-45')).toBe('Authentication.Errors.invalidPhoneLength');
	});

	it('returns invalidPhoneCharacters if characters are invalid', () => {
		expect(getPhoneNumberFeedbackMessage('+1 123-456-78x0')).toBe('Authentication.Errors.invalidPhoneCharacters');
	});

	it('returns empty string if phone is valid', () => {
		expect(getPhoneNumberFeedbackMessage('+1 123-456-7890')).toBe('');
		expect(getPhoneNumberFeedbackMessage('001234567890')).toBe('');
	});
});
