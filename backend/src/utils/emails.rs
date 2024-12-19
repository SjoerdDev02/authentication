use crate::models::translations_models::Translations;
use crate::templates::auth_templates::{
    VERIFICATION_CODE_SUCCESS_TEMPLATE, VERIFICATION_CODE_TEMPLATE,
};
use crate::utils::templates::generate_template;
use axum::http::StatusCode;
use lettre::message::{header, MultiPart, SinglePart};
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use std::collections::HashMap;
use std::fs::File;
use std::io::Read;
use crate::utils::env::get_environment_variable;

pub async fn send_email_with_template(
    recipient: &str,
    subject: &str,
    body: &str,
    image_data: Vec<u8>,
) -> Result<(), StatusCode> {
    let email = Message::builder()
        .from("NoBody <nobody@domain.tld>".parse().unwrap())
        .reply_to("Yuin <yuin@domain.tld>".parse().unwrap())
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
                        .header(header::ContentType::parse("image/png").unwrap())
                        .header(header::ContentDisposition::inline())
                        .header(header::ContentId::from("cid_image".to_string()))
                        .body(image_data),
                ),
        );

        let email = match email {
            Ok(email) => email,
            Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR)
        };

        let env_email = match get_environment_variable("EMAIL_USER") {
            Ok(env_email) => env_email,
            Err(_) => return Err(StatusCode::BAD_REQUEST)
        };

        let env_password = match get_environment_variable("EMAIL_PASSWORD") {
            Ok(env_password) => env_password,
            Err(_) => return Err(StatusCode::BAD_REQUEST)
        };

    let creds = Credentials::new(env_email, env_password);

    let mailer = SmtpTransport::relay("smtp.gmail.com")
        .unwrap()
        .credentials(creds)
        .build();

    match mailer.send(&email) {
        Ok(_) => Ok(()),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

// ? otc_type can be confirm_account, update_account or delete_account
pub async fn send_otc_email(
    translations: &Translations,
    otc_type: &str,
    otc_code: &str,
    email: &str,
) -> Result<(), StatusCode> {
        let client_base_url = match get_environment_variable("CLIENT_BASE_URL") {
            Ok(client_base_url) => client_base_url,
            Err(_) => return Err(StatusCode::BAD_REQUEST)
        };

    if let Some(emails) = &translations.emails {
        if let Some(otc_translations) = emails.get("otc") {
            if let Some(otc_data) = otc_translations.get(&otc_type) {
                let mut template_variables: HashMap<&str, &str> = HashMap::new();

                if let Some(header) = otc_data.get("header").and_then(|str| str.as_str()) {
                    template_variables.insert("header_title", header);
                }

                if let Some(code_description) = otc_data
                    .get("code_description")
                    .and_then(|str| str.as_str())
                {
                    template_variables.insert("code_description", code_description);
                }

                if let Some(link_description) = otc_data
                    .get("link_description")
                    .and_then(|str| str.as_str())
                {
                    template_variables.insert("link_title", link_description);
                }
                if let Some(footer_note) = otc_data.get("footer_note").and_then(|str| str.as_str())
                {
                    template_variables.insert("footer_note", footer_note);
                }

                template_variables.insert("otc", otc_code);
                let otc_link = format!("{}/otc?otc={}", client_base_url, otc_code);
                template_variables.insert("otc_link", otc_link.as_str());

                let mut image_file = File::open("/app/src/static/images/code_image.png")
                    .expect("Image file not found");
                let mut image_data = Vec::new();
                image_file
                    .read_to_end(&mut image_data)
                    .expect("Failed to read image");

                if let (Some(template_name), Some(subject)) = (
                    otc_data.get("template_name").and_then(|str| str.as_str()),
                    otc_data.get("subject").and_then(|str| str.as_str()),
                ) {
                    let email_body = generate_template(
                        VERIFICATION_CODE_TEMPLATE,
                        template_name,
                        template_variables,
                    )
                    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

                    if let Err(_) =
                        send_email_with_template(&email, &subject, &email_body, image_data).await
                    {
                        return Err(StatusCode::INTERNAL_SERVER_ERROR);
                    }
                } else {
                    return Err(StatusCode::INTERNAL_SERVER_ERROR);
                }
            } else {
                return Err(StatusCode::INTERNAL_SERVER_ERROR);
            }
        } else {
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    } else {
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    Ok(())
}

// ? otc_type can be confirm_account, update_account or delete_account
pub async fn send_otc_success_email(
    translations: &Translations,
    otc_type: &str,
    email: &str,
) -> Result<(), StatusCode> {
    if let Some(emails) = &translations.emails {
        if let Some(otc_translations) = emails.get("otc_success") {
            if let Some(otc_data) = otc_translations.get(&otc_type) {
                let mut template_variables: HashMap<&str, &str> = HashMap::new();

                if let Some(header) = otc_data.get("header").and_then(|str| str.as_str()) {
                    template_variables.insert("header_title", header);
                }

                if let Some(footer_note) = otc_data.get("footer_note").and_then(|str| str.as_str())
                {
                    template_variables.insert("footer_note", footer_note);
                }

                let mut image_file = File::open("/app/src/static/images/success_image.png")
                    .expect("Image file not found");
                let mut image_data = Vec::new();
                image_file
                    .read_to_end(&mut image_data)
                    .expect("Failed to read image");

                if let (Some(template_name), Some(subject)) = (
                    otc_data.get("template_name").and_then(|str| str.as_str()),
                    otc_data.get("subject").and_then(|str| str.as_str()),
                ) {
                    let email_body = generate_template(
                        VERIFICATION_CODE_SUCCESS_TEMPLATE,
                        template_name,
                        template_variables,
                    )
                    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

                    if let Err(_) =
                        send_email_with_template(&email, &subject, &email_body, image_data).await
                    {
                        return Err(StatusCode::INTERNAL_SERVER_ERROR);
                    }
                } else {
                    return Err(StatusCode::INTERNAL_SERVER_ERROR);
                }
            } else {
                return Err(StatusCode::INTERNAL_SERVER_ERROR);
            }
        } else {
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    } else {
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    Ok(())
}
