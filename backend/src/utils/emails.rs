use axum::http::StatusCode;
use dotenv::dotenv;
use lettre::message::{header, MultiPart, SinglePart};
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use std::env;

pub async fn send_email_with_template(
    recipient: &str,
    subject: &str,
    body: &str,
    image_data: Vec<u8>,
) -> Result<(), StatusCode> {
    dotenv().ok();

    let email = Message::builder()
        .from("NoBody <nobody@domain.tld>".parse().unwrap())
        .reply_to("Yuin <yuin@domain.tld>".parse().unwrap())
        .to(recipient
            .parse()
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?)
        .subject(subject)
        .multipart(
            MultiPart::mixed()
                .singlepart(SinglePart::builder()
                    .header(header::ContentType::TEXT_HTML)
                    .body(body.to_string()))
                .singlepart(SinglePart::builder()
                    .header(header::ContentType::parse("image/png").unwrap())
                    .header(header::ContentDisposition::inline())
                    .header(header::ContentId::from("cid_image".to_string()))
                    .body(image_data)),
        )
        .unwrap();

    let env_email = env::var("EMAIL_USER").map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let env_password = env::var("EMAIL_PASSWORD").map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let creds = Credentials::new(env_email, env_password);

    let mailer = SmtpTransport::relay("smtp.gmail.com")
        .unwrap()
        .credentials(creds)
        .build();

    match mailer.send(&email) {
        Ok(_) => Ok(()),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}
