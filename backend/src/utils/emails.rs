use axum::http::StatusCode;
use dotenv::dotenv;
use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use std::env;

pub async fn send_email_with_template(
    recipient: &str,
    subject: &str,
    body: &str,
) -> Result<(), StatusCode> {
    dotenv().ok();

    let email = Message::builder()
        .from("NoBody <nobody@domain.tld>".parse().unwrap())
        .reply_to("Yuin <yuin@domain.tld>".parse().unwrap())
        .to(recipient
            .parse()
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?)
        .subject(subject)
        .header(ContentType::TEXT_HTML)
        .body(body.to_string())
        .unwrap();

    let env_email = env::var("MY_EMAIL").map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let env_password = env::var("MY_PASSWORD").map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let creds = Credentials::new(env_email, env_password);

    let mailer = SmtpTransport::relay("smtp.gmail.com")
        .unwrap()
        .credentials(creds)
        .build();

    match mailer.send(&email) {
        Ok(_) => Ok(()),
        Err(e) => panic!("Could not send email: {e:?}"),
    }
}
