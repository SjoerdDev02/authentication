use crate::models::translations::Translations;
use crate::templates::otc::{VERIFICATION_CODE_SUCCESS_TEMPLATE, VERIFICATION_CODE_TEMPLATE};
use crate::templates::user::PASSWORD_RESET_CODE_TEMPLATE;
use crate::utils::env::get_environment_variable;
use crate::utils::templates::generate_template;
use crate::utils::translations::get_translation_by_key;
use axum::http::StatusCode;
use lettre::message::{header, MultiPart, SinglePart};
use lettre::transport::smtp::authentication::Credentials;
use lettre::transport::smtp::client::Tls;
use lettre::{Message, SmtpTransport, Transport};
use std::collections::HashMap;
use std::fs::File;
use std::io::Read;

pub async fn send_email_with_template(
    recipient: &str,
    subject: &str,
    body: &str,
    image_data: Vec<u8>,
) -> Result<(), StatusCode> {
    let env_email = match get_environment_variable("EMAIL_USER") {
        Ok(env_email) => env_email,
        Err(_) => return Err(StatusCode::BAD_REQUEST),
    };

    let env_smtp_host = match get_environment_variable("SMTP_HOST") {
        Ok(env_email) => env_email,
        Err(_) => return Err(StatusCode::BAD_REQUEST),
    };

    let from_header = match env_email.parse() {
        Ok(header) => header,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let image_contenttype_header = match header::ContentType::parse("image/png") {
        Ok(header) => header,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let email = Message::builder()
        .from(from_header)
        .reply_to(
            recipient
                .parse()
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?,
        )
        .to(recipient
            .parse()
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?)
        .subject(subject)
        .multipart(
            MultiPart::mixed()
                .singlepart(
                    SinglePart::builder()
                        .header(header::ContentType::TEXT_HTML)
                        .body(body.to_string()),
                )
                .singlepart(
                    SinglePart::builder()
                        .header(image_contenttype_header)
                        .header(header::ContentDisposition::inline())
                        .header(header::ContentId::from("cid_image".to_string()))
                        .body(image_data),
                ),
        )
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let mailer = if env_smtp_host == "mailpit" {
        SmtpTransport::relay(&env_smtp_host)
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
            .port(1025)
            .tls(Tls::None)
            .build()
    } else {
        let env_password = match get_environment_variable("EMAIL_PASSWORD") {
            Ok(env_password) => env_password,
            Err(_) => return Err(StatusCode::BAD_REQUEST),
        };

        let creds = Credentials::new(env_email.clone(), env_password);

        SmtpTransport::relay(&env_smtp_host)
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
            .credentials(creds)
            .build()
    };

    match mailer.send(&email) {
        Ok(_) => Ok(()),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub async fn send_otc_email(
    translations: &Translations,
    otc_type: &str, // ? can be confirm_account, update_account or delete_account
    otc_code: &str,
    email: &str,
) -> Result<(), StatusCode> {
    let client_base_url = match get_environment_variable("CLIENT_BASE_URL") {
        Ok(client_base_url) => client_base_url,
        Err(_) => return Err(StatusCode::BAD_REQUEST),
    };

    let mut template_variables: HashMap<&str, &str> = HashMap::new();

    let template_name = get_translation_by_key(
        &translations,
        &format!("auth.emails.otc.{}.template_name", &otc_type),
    );
    let subject = get_translation_by_key(
        &translations,
        &format!("auth.emails.otc.{}.subject", &otc_type),
    );
    let header = get_translation_by_key(
        &translations,
        &format!("auth.emails.otc.{}.header", &otc_type),
    );
    let code_description = get_translation_by_key(
        &translations,
        &format!("auth.emails.otc.{}.code_description", &otc_type),
    );
    let link_description = get_translation_by_key(
        &translations,
        &format!("auth.emails.otc.{}.link_description", &otc_type),
    );
    let footer_note = get_translation_by_key(
        &translations,
        &format!("auth.emails.otc.{}.footer_note", &otc_type),
    );

    let otc_link = format!("{}/otc?otc={}", client_base_url, otc_code);

    template_variables.insert("header_title", &header);
    template_variables.insert("code_description", &code_description);
    template_variables.insert("link_title", &link_description);
    template_variables.insert("footer_note", &footer_note);
    template_variables.insert("otc", otc_code);
    template_variables.insert("otc_link", &otc_link);

    let email_body = generate_template(
        VERIFICATION_CODE_TEMPLATE,
        &template_name,
        template_variables,
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let mut image_file =
        File::open("/app/src/static/images/code_image.png").expect("Image file not found");

    let mut image_data = Vec::new();

    image_file
        .read_to_end(&mut image_data)
        .expect("Failed to read image");

    send_email_with_template(&email, &subject, &email_body, image_data).await?;

    Ok(())
}

pub async fn send_otc_success_email(
    translations: &Translations,
    otc_type: &str, // ? can be confirm_account, update_account or delete_account
    email: &str,
) -> Result<(), StatusCode> {
    let mut template_variables: HashMap<&str, &str> = HashMap::new();

    let template_name = get_translation_by_key(
        &translations,
        &format!("auth.emails.otc_success.{}.template_name", &otc_type),
    );

    let subject = get_translation_by_key(
        &translations,
        &format!("auth.emails.otc_success.{}.subject", &otc_type),
    );

    let header = get_translation_by_key(
        &translations,
        &format!("auth.emails.otc_success.{}.header", &otc_type),
    );

    let footer_note = get_translation_by_key(
        &translations,
        &format!("auth.emails.otc_success.{}.footer_note", &otc_type),
    );

    template_variables.insert("header_title", &header);
    template_variables.insert("footer_note", &footer_note);

    let email_body = generate_template(
        VERIFICATION_CODE_SUCCESS_TEMPLATE,
        &template_name,
        template_variables,
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let mut image_file =
        File::open("/app/src/static/images/success_image.png").expect("Image file not found");

    let mut image_data = Vec::new();

    image_file
        .read_to_end(&mut image_data)
        .expect("Failed to read image");

    send_email_with_template(&email, &subject, &email_body, image_data).await?;

    Ok(())
}

pub async fn send_password_reset_email(
    translations: &Translations,
    reset_password_code: &str,
    email: &str,
) -> Result<(), StatusCode> {
    let client_base_url = match get_environment_variable("CLIENT_BASE_URL") {
        Ok(client_base_url) => client_base_url,
        Err(_) => return Err(StatusCode::BAD_REQUEST),
    };

    let mut template_variables: HashMap<&str, &str> = HashMap::new();

    let template_name =
        get_translation_by_key(&translations, "auth.emails.password_reset.template_name");

    let subject = get_translation_by_key(&translations, "auth.emails.password_reset.subject");

    let header = get_translation_by_key(&translations, "auth.emails.password_reset.header");

    let code_description =
        get_translation_by_key(&translations, "auth.emails.password_reset.code_description");

    let link_description =
        get_translation_by_key(&translations, "auth.emails.password_reset.link_description");

    let footer_note =
        get_translation_by_key(&translations, "auth.emails.password_reset.footer_note");

    let password_reset_link = format!(
        "{}/reset-password?password-reset-token={}",
        client_base_url, reset_password_code
    );

    template_variables.insert("header_title", &header);
    template_variables.insert("code_description", &code_description);
    template_variables.insert("link_title", &link_description);
    template_variables.insert("footer_note", &footer_note);
    template_variables.insert("reset_token", reset_password_code);
    template_variables.insert("password_reset_link", &password_reset_link);

    let email_body = generate_template(
        PASSWORD_RESET_CODE_TEMPLATE,
        &template_name,
        template_variables,
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let mut image_file =
        File::open("/app/src/static/images/code_image.png").expect("Image file not found");

    let mut image_data = Vec::new();

    image_file
        .read_to_end(&mut image_data)
        .expect("Failed to read image");

    send_email_with_template(&email, &subject, &email_body, image_data).await?;

    Ok(())
}
