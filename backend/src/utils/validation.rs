use regex::Regex;

use crate::models::user::models::{PasswordResetUser, RegisterUser, UpdateUser};

pub fn get_email_feedback_message(email: &str) -> Option<&str> {
    if Regex::new(r"[^A-Za-z0-9.@-]").ok()?.is_match(email) {
        Some("authentication.errors.invalid_characters")
    } else if !email.contains('@') {
        Some("authentication.errors.missing_at_symbol")
    } else if !Regex::new(r"^[A-Za-z0-9.-]{2,20}").ok()?.is_match(email) {
        Some("authentication.errors.invalid_email_start")
    } else if !Regex::new(r"^[A-Za-z0-9.-]{2,20}@[a-z]{2,10}")
        .ok()?
        .is_match(email)
    {
        Some("authentication.errors.invalid_domain_name")
    } else if !Regex::new(r"\.[a-z]{2,5}$").ok()?.is_match(email) {
        Some("authentication.errors.missing_or_invalid_tld")
    } else {
        None
    }
}

pub fn get_password_feedback_message(password: &str) -> Option<&str> {
    if password.len() < 8 {
        Some("authentication.errors.password_too_short")
    } else if !Regex::new(r"[A-Z]").ok()?.is_match(password) {
        Some("authentication.errors.missing_uppercase")
    } else if !Regex::new(r"\d").ok()?.is_match(password) {
        Some("authentication.errors.missing_number")
    } else if !Regex::new(r"[-!]").ok()?.is_match(password) {
        Some("authentication.errors.missing_special_character")
    } else if Regex::new(r"[^A-Za-z\d\-!]").ok()?.is_match(password) {
        Some("authentication.errors.invalid_characters")
    } else {
        None
    }
}

pub fn get_phone_number_feedback_message(phone: &str) -> Option<&str> {
    let digits_only = phone.chars().filter(|c| c.is_digit(10)).count();

    if !Regex::new(r"^\+?\d{1,3}?").ok()?.is_match(phone) {
        Some("authentication.errors.invalid_phone_country_code")
    } else if digits_only < 10 {
        Some("authentication.errors.invalid_phone_length")
    } else if Regex::new(r"[^0-9\s()+-]").ok()?.is_match(phone) {
        Some("authentication.errors.invalid_phone_characters")
    } else {
        None
    }
}

pub fn get_name_feedback_message(name: &str) -> Option<&str> {
    if name.len() < 1 {
        Some("authentication.errors.invalid_name")
    } else {
        None
    }
}

pub fn validate_register_user_data(user: &RegisterUser) -> Option<&str> {
    if let Some(error) = get_name_feedback_message(&user.name) {
        return Some(error);
    }

    if let Some(error) = get_email_feedback_message(&user.email) {
        return Some(error);
    }

    if let Some(error) = get_password_feedback_message(&user.password) {
        return Some(error);
    }

    if &user.password != &user.password_confirm {
        return Some("auth.errors.password_mismatch");
    }

    None
}

pub fn validate_update_user_data(user: &UpdateUser) -> Option<&str> {
    if let Some(error) = get_name_feedback_message(&user.name) {
        return Some(error);
    }

    if let Some(error) = get_email_feedback_message(&user.email) {
        return Some(error);
    }

    if let Some(email_confirm) = &user.email_confirm {
        if &user.email != email_confirm {
            return Some("auth.errors.email_mismatch");
        }
    }

    if let (Some(password), Some(password_confirm)) = (&user.password, &user.password_confirm) {
        if let Some(error) = get_password_feedback_message(password) {
            return Some(error);
        }

        if password != password_confirm {
            return Some("auth.errors.password_mismatch");
        }
    }

    if let Some(phone) = &user.phone {
        if let Some(error) = get_phone_number_feedback_message(phone) {
            return Some(error);
        }
    }

    None
}

pub fn validate_password_reset_user_data(user: &PasswordResetUser) -> Option<&str> {
    if let Some(error) = get_password_feedback_message(&user.password) {
        return Some(error);
    }

    if &user.password != &user.password_confirm {
        return Some("auth.errors.password_mismatch");
    }

    None
}
