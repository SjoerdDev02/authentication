#[cfg(test)]
mod tests {
    mod email_validation_tests {
        use backend::utils::validation::get_email_feedback_message;

        #[test]
        fn test_get_email_feedback_message_valid_email() {
            let email = "user@domain.com";
            assert_eq!(get_email_feedback_message(email), None);
        }

        #[test]
        fn test_get_email_feedback_message_invalid_start() {
            let email = "a@domain.com";
            assert_eq!(
                get_email_feedback_message(email),
                Some("authentication.errors.invalid_email_start")
            );
        }

        #[test]
        fn test_get_email_feedback_message_missing_at_symbol() {
            let email = "userdomain.com";
            assert_eq!(
                get_email_feedback_message(email),
                Some("authentication.errors.missing_at_symbol")
            );
        }

        #[test]
        fn test_get_email_feedback_message_invalid_domain_name() {
            let email = "user@a.com";
            assert_eq!(
                get_email_feedback_message(email),
                Some("authentication.errors.invalid_domain_name")
            );
        }

        #[test]
        fn test_get_email_feedback_message_missing_tld() {
            let email = "user@domain";
            assert_eq!(
                get_email_feedback_message(email),
                Some("authentication.errors.missing_or_invalid_tld")
            );
        }

        #[test]
        fn test_get_email_feedback_message_invalid_tld() {
            let email = "user@domain.abcdef";
            assert_eq!(
                get_email_feedback_message(email),
                Some("authentication.errors.missing_or_invalid_tld")
            );
        }

        #[test]
        fn test_get_email_feedback_message_invalid_characters() {
            let email = "user*name@domain.com";
            assert_eq!(
                get_email_feedback_message(email),
                Some("authentication.errors.invalid_characters")
            );
        }
    }

    mod password_validation_tests {
        use backend::utils::validation::get_password_feedback_message;

        #[test]
        fn test_get_password_feedback_message_valid_password() {
            let password = "Password1!";
            assert_eq!(get_password_feedback_message(password), None);
        }

        #[test]
        fn test_get_password_feedback_message_too_short() {
            let password = "Pass1!";
            assert_eq!(
                get_password_feedback_message(password),
                Some("authentication.errors.password_too_short")
            );
        }

        #[test]
        fn test_get_password_feedback_message_missing_uppercase() {
            let password = "password1!";
            assert_eq!(
                get_password_feedback_message(password),
                Some("authentication.errors.missing_uppercase")
            );
        }

        #[test]
        fn test_get_password_feedback_message_missing_number() {
            let password = "Password!";
            assert_eq!(
                get_password_feedback_message(password),
                Some("authentication.errors.missing_number")
            );
        }

        #[test]
        fn test_get_password_feedback_message_missing_special_character() {
            let password = "Password1";
            assert_eq!(
                get_password_feedback_message(password),
                Some("authentication.errors.missing_special_character")
            );
        }

        #[test]
        fn test_get_password_feedback_message_invalid_characters() {
            let password = "Password1!@";
            assert_eq!(
                get_password_feedback_message(password),
                Some("authentication.errors.invalid_characters")
            );
        }
    }

    mod phone_number_validation_tests {
        use backend::utils::validation::get_phone_number_feedback_message;

        #[test]
        fn test_get_phone_number_feedback_message_valid_phone() {
            let phone = "+1 (123) 456-7890";
            assert_eq!(get_phone_number_feedback_message(phone), None);
        }

        #[test]
        fn test_get_phone_number_feedback_message_invalid_country_code() {
            let phone = "abc1234567890";
            assert_eq!(
                get_phone_number_feedback_message(phone),
                Some("authentication.errors.invalid_phone_country_code")
            );
        }

        #[test]
        fn test_get_phone_number_feedback_message_too_few_digits() {
            let phone = "+1 234-567";
            assert_eq!(
                get_phone_number_feedback_message(phone),
                Some("authentication.errors.invalid_phone_length")
            );
        }

        #[test]
        fn test_get_phone_number_feedback_message_invalid_characters() {
            let phone = "+1 (123) 456-78*0";
            assert_eq!(
                get_phone_number_feedback_message(phone),
                Some("authentication.errors.invalid_phone_characters")
            );
        }
    }

    mod name_validation_tests {
        use backend::utils::validation::get_name_feedback_message;

        #[test]
        fn test_get_name_feedback_message_valid_name() {
            let name = "John";
            assert_eq!(get_name_feedback_message(name), None);
        }

        #[test]
        fn test_get_name_feedback_message_empty_name() {
            let name = "";
            assert_eq!(
                get_name_feedback_message(name),
                Some("authentication.errors.invalid_name")
            );
        }
    }

    mod register_user_validation_tests {
        use backend::{
            models::user::models::RegisterUser, utils::validation::validate_register_user_data,
        };

        #[test]
        fn test_validate_register_user_data_valid_user() {
            let user = RegisterUser {
                name: "John Doe".to_string(),
                email: "john@example.com".to_string(),
                password: "Password1!".to_string(),
                password_confirm: "Password1!".to_string(),
            };
            assert_eq!(validate_register_user_data(&user), None);
        }

        #[test]
        fn test_validate_register_user_data_invalid_name() {
            let user = RegisterUser {
                name: "".to_string(),
                email: "john@example.com".to_string(),
                password: "Password1!".to_string(),
                password_confirm: "Password1!".to_string(),
            };
            assert_eq!(
                validate_register_user_data(&user),
                Some("authentication.errors.invalid_name")
            );
        }

        #[test]
        fn test_validate_register_user_data_invalid_email() {
            let user = RegisterUser {
                name: "John Doe".to_string(),
                email: "john@example".to_string(),
                password: "Password1!".to_string(),
                password_confirm: "Password1!".to_string(),
            };
            assert_eq!(
                validate_register_user_data(&user),
                Some("authentication.errors.missing_or_invalid_tld")
            );
        }

        #[test]
        fn test_validate_register_user_data_invalid_password() {
            let user = RegisterUser {
                name: "John Doe".to_string(),
                email: "john@example.com".to_string(),
                password: "password".to_string(),
                password_confirm: "password".to_string(),
            };
            assert_eq!(
                validate_register_user_data(&user),
                Some("authentication.errors.missing_uppercase")
            );
        }

        #[test]
        fn test_validate_register_user_data_password_mismatch() {
            let user = RegisterUser {
                name: "John Doe".to_string(),
                email: "john@example.com".to_string(),
                password: "Password1!".to_string(),
                password_confirm: "Password2!".to_string(),
            };
            assert_eq!(
                validate_register_user_data(&user),
                Some("auth.errors.password_mismatch")
            );
        }
    }

    mod update_user_validation_tests {
        use backend::{
            models::user::models::UpdateUser, utils::validation::validate_update_user_data,
        };

        #[test]
        fn test_validate_update_user_data_valid_user() {
            let user = UpdateUser {
                id: 123,
                name: "John Doe".to_string(),
                email: "john@example.com".to_string(),
                email_confirm: Some("john@example.com".to_string()),
                password: Some("Password1!".to_string()),
                password_confirm: Some("Password1!".to_string()),
                phone: Some("+1 (123) 456-7890".to_string()),
            };
            assert_eq!(validate_update_user_data(&user), None);
        }

        #[test]
        fn test_validate_update_user_data_invalid_name() {
            let user = UpdateUser {
                id: 123,
                name: "".to_string(),
                email: "john@example.com".to_string(),
                email_confirm: Some("john@example.com".to_string()),
                password: None,
                password_confirm: None,
                phone: None,
            };
            assert_eq!(
                validate_update_user_data(&user),
                Some("authentication.errors.invalid_name")
            );
        }

        #[test]
        fn test_validate_update_user_data_email_mismatch() {
            let user = UpdateUser {
                id: 123,
                name: "John Doe".to_string(),
                email: "john@example.com".to_string(),
                email_confirm: Some("different@example.com".to_string()),
                password: None,
                password_confirm: None,
                phone: None,
            };
            assert_eq!(
                validate_update_user_data(&user),
                Some("auth.errors.email_mismatch")
            );
        }

        #[test]
        fn test_validate_update_user_data_invalid_phone() {
            let user = UpdateUser {
                id: 123,
                name: "John Doe".to_string(),
                email: "john@example.com".to_string(),
                email_confirm: None,
                password: None,
                password_confirm: None,
                phone: Some("123".to_string()),
            };
            assert_eq!(
                validate_update_user_data(&user),
                Some("authentication.errors.invalid_phone_length")
            );
        }
    }

    mod password_reset_user_validation_tests {
        use backend::{
            models::user::models::PasswordResetUser,
            utils::validation::validate_password_reset_user_data,
        };

        #[test]
        fn test_validate_password_reset_user_data_valid_user() {
            let user = PasswordResetUser {
                password: "Password1!".to_string(),
                password_confirm: "Password1!".to_string(),
            };
            assert_eq!(validate_password_reset_user_data(&user), None);
        }

        #[test]
        fn test_validate_password_reset_user_data_invalid_password() {
            let user = PasswordResetUser {
                password: "password".to_string(),
                password_confirm: "password".to_string(),
            };
            assert_eq!(
                validate_password_reset_user_data(&user),
                Some("authentication.errors.missing_uppercase")
            );
        }

        #[test]
        fn test_validate_password_reset_user_data_password_mismatch() {
            let user = PasswordResetUser {
                password: "Password1!".to_string(),
                password_confirm: "Password2!".to_string(),
            };
            assert_eq!(
                validate_password_reset_user_data(&user),
                Some("auth.errors.password_mismatch")
            );
        }
    }
}
