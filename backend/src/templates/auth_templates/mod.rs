pub const VERIFICATION_CODE_TEMPLATE: &str = include_str!("verification_code.html");
pub const CONFIRM_ACCOUNT_CREATION_TEMPLATE: &str = include_str!("confirm_account_creation.html");
pub const DELETED_ACCOUNT_TEMPLATE: &str = include_str!("deleted_account.html");
pub const UPDATED_ACCOUNT_NEW_EMAIL_TEMPLATE: &str = include_str!("updated_account_new_email.html");
pub const UPDATED_ACCOUNT_OLD_EMAIL_TEMPLATE: &str = include_str!("updated_account_old_email.html");
pub const UPDATED_ACCOUNT_PASSWORD_TEMPLATE: &str = include_str!("updated_account_password.html");

pub fn generate_confirm_account_creation_email(name: &str) -> String {
    let template = include_str!("confirm_account_creation.html");

    template.replace("{{ name }}", name)
}