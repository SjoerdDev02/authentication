use std::collections::HashMap;
use std::fs::File;
use std::io::Read;

use crate::constants::auth_constants::{JWT_EXPIRATION_SECONDS, OTC_EXPIRATION_SECONDS};
use crate::models::auth_models::{
    AuthResponse, AuthState, DeleteUser, LoginUser, MinifiedAuthResponse, Otc, OtcPayload,
    RegisterUser, UpdateUser,
};
use crate::templates::auth_templates::{
    VERIFICATION_CODE_SUCCESS_TEMPLATE, VERIFICATION_CODE_TEMPLATE,
};
use crate::utils::auth_utils::{
    confirm_user, create_otc, create_user, delete_user_by_id, encode_jwt, format_jwt_token_key,
    format_otc_key, get_user_by_email, get_user_by_id, hash_password, update_user_email_and_name,
    update_user_password, verify_password,
};
use crate::utils::emails::send_email_with_template;
use crate::utils::redis_utils::{get_token, remove_token, set_token, verify_token};
use crate::utils::templates::generate_template;
use axum::{
    extract::{Json, State},
    http::StatusCode,
};
use base64::prelude::BASE64_STANDARD;
use base64::Engine;

pub async fn register_user(
    State(state): State<AuthState>,
    Json(user_data): Json<RegisterUser>,
) -> Result<Json<MinifiedAuthResponse>, StatusCode> {
    if user_data.password != user_data.password_confirm {
        return Err(StatusCode::BAD_REQUEST);
    }

    let existing_user = get_user_by_email(&state, &user_data.email).await;

    if existing_user.is_ok() {
        return Err(StatusCode::CONFLICT);
    }

    let create_user_result = match create_user(
        &state,
        &user_data.name,
        &user_data.email,
        &user_data.password,
    )
    .await
    {
        Ok(user) => user,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let user_id: i32 = match create_user_result.last_insert_id().try_into() {
        Ok(id) => id,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let user = match get_user_by_id(&state, &user_id).await {
        Ok(user) => user,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let (id, name, email) = user;

    let otc = create_otc();
    let otc_key = format_otc_key(&otc);

    let otc_payload = OtcPayload {
        otc: otc.to_string(),
        user_id: id,
        action: "confirm_account".to_string(),
        name: None,
        email: None,
        password_hash: None,
    };

    let otc_payload_json =
        serde_json::to_string(&otc_payload).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    set_token(&state, &otc_key, &otc_payload_json, OTC_EXPIRATION_SECONDS).await;

    let mut template_variables: HashMap<&str, String> = HashMap::new();
    // let mut image_file = File::open("src/static/images/code_image.png").expect("Image file not found");
    let mut image_file = File::open("/app/src/static/images/code_image.png").expect("Image file not found");
    let mut image_data = Vec::new();
    image_file.read_to_end(&mut image_data).expect("Failed to read image");
    let base64_image = BASE64_STANDARD.encode(&image_data);
    let image_data_url = format!("data:image/png;base64,{}", base64_image);
    template_variables.insert("image_url", image_data_url);
    template_variables.insert(
        "header_title",
        format!(
            "Congratulations {}! You've successfully created your account",
            user_data.name
        ),
    );
    template_variables.insert(
        "code_description",
        "Enter this code to confirm your account".to_string(),
    );
    template_variables.insert("otc", otc.to_string());
    template_variables.insert(
        "link_title",
        "You can also enter this link to confirm your account".to_string(),
    );
    template_variables.insert("otc_link", format!("http://example.com/confirm/{}", otc));
    template_variables.insert(
        "footer_note",
        "If you did not create this account, please ignore this email.".to_string(),
    );

    let email_body = generate_template(
        VERIFICATION_CODE_TEMPLATE,
        "Confirm account creation",
        template_variables,
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if let Err(_) = send_email_with_template(&email, "Confirm your account", &email_body).await {
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    let response = MinifiedAuthResponse {
        name,
        email,
    };

    Ok(Json(response))
}

pub async fn otc_user(
    State(state): State<AuthState>,
    Json(user_data): Json<Otc>,
) -> Result<Json<MinifiedAuthResponse>, StatusCode> {
    let otc_key = format_otc_key(&user_data.otc);

    let token_payload: Option<OtcPayload> = get_token(&state, &otc_key)
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED)?
        .map(|json| serde_json::from_str(&json).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)) // Deserialize JSON, return internal error on failure
        .transpose()?;

    let token_payload = match token_payload {
        Some(payload) => payload,
        None => return Err(StatusCode::UNAUTHORIZED),
    };

    remove_token(&state, &otc_key)
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    let action = token_payload.action;
    let user_id = token_payload.user_id;
    let email = token_payload.email;
    let name = token_payload.name;
    let password_hash = token_payload.password_hash;

    let mut template_variables: HashMap<&str, String> = HashMap::new();
    // let mut image_file = File::open("src/static/images/code_image.png").expect("Image file not found");
    let mut image_file = File::open("/app/src/static/images/code_image.png").expect("Image file not found");
    let mut image_data = Vec::new();
    image_file.read_to_end(&mut image_data).expect("Failed to read image");
    let base64_image = BASE64_STANDARD.encode(&image_data);
    let image_data_url = format!("data:image/png;base64,{}", base64_image);
    template_variables.insert("image_url", image_data_url);
    let mut template_name = "";

    match action.as_str() {
        "update_name_and_email" => {
            if let (Some(name), Some(email)) = (&name, &email) {
                update_user_email_and_name(&state, &user_id, name, email)
                    .await
                    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

                template_name = "Successfully updated account";

                template_variables.insert(
                    "header_title",
                    format!(
                        "Congratulations {}! You've successfully updated your account",
                        name
                    ),
                );
                template_variables.insert(
                    "footer_note",
                    "If you did not create this account, please ignore this email.".to_string(),
                );
            }
        }
        "update_password" => {
            if let Some(password_hash) = &password_hash {
                update_user_password(&state, &user_id, password_hash)
                    .await
                    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

                template_name = "Successfully updated account";

                template_variables.insert(
                    "header_title",
                    "Congratulations! You've successfully updated your account".to_string(),
                );
                template_variables.insert(
                    "footer_note",
                    "If you did not update this account, please contact us.".to_string(),
                );
            }
        }
        "delete_account" => {
            delete_user_by_id(&state, &user_id)
                .await
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            template_name = "Successfully deleted account";

            template_variables.insert(
                "header_title",
                "We're sorry to see you go {}. You've successfully deleted your account"
                    .to_string(),
            );
            template_variables.insert(
                "footer_note",
                "If you did not delete your account, please contact us.".to_string(),
            );
        }
        "confirm_account" => {
            confirm_user(&state, &user_id)
                .await
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            template_name = "Successfully confirmed account";

            template_variables.insert(
                "header_title",
                "Congratulations {}! You've successfully confirmed your account".to_string(),
            );
            template_variables.insert(
                "footer_note",
                "If you did not confirm your account, please contact us.".to_string(),
            );
        }
        _ => return Err(StatusCode::BAD_REQUEST),
    }

    let (_, name, email) = match get_user_by_id(&state, &user_id).await {
        Ok(user) => user,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let email_body = generate_template(
        VERIFICATION_CODE_SUCCESS_TEMPLATE,
        &template_name,
        template_variables,
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if let Err(_) = send_email_with_template(&email, &template_name, &email_body).await {
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    Ok(Json(MinifiedAuthResponse { name, email }))
}

pub async fn login_user(
    State(state): State<AuthState>,
    Json(user_data): Json<LoginUser>,
) -> Result<Json<AuthResponse>, StatusCode> {
    let user = match get_user_by_email(&state, &user_data.email).await {
        Ok(user) => user,
        Err(_) => return Err(StatusCode::UNAUTHORIZED),
    };

    let (id, name, email, password_hash) = user;

    if !verify_password(&user_data.password, &password_hash)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let token = encode_jwt(&user_data.email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let jwt_key = format_jwt_token_key(&token);

    println!("key {}", jwt_key);

    set_token(&state, &jwt_key, &id.to_string(), JWT_EXPIRATION_SECONDS).await;

    let response = AuthResponse {
        id,
        token,
        name,
        email,
    };

    Ok(Json(response))
}

pub async fn update_user(
    State(state): State<AuthState>,
    Json(user_data): Json<UpdateUser>,
) -> Result<StatusCode, StatusCode> {
    let otc = create_otc();
    let otc_key = format_otc_key(&otc);

    if let (Some(email), Some(name)) = (&user_data.email, &user_data.name) {
        let otc_payload = OtcPayload {
            otc: otc.to_string(),
            user_id: user_data.id,
            action: "update_name_and_email".to_string(),
            name: Some(name.to_string()),
            email: Some(email.to_string()),
            password_hash: None,
        };

        let otc_payload_json =
            serde_json::to_string(&otc_payload).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        set_token(&state, &otc_key, &otc_payload_json, OTC_EXPIRATION_SECONDS).await;
    }

    if let (Some(password), Some(password_confirm)) =
        (&user_data.password, &user_data.password_confirm)
    {
        if password != password_confirm {
            return Err(StatusCode::BAD_REQUEST);
        }

        let password_hash =
            hash_password(password).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        let otc_payload = OtcPayload {
            otc: otc.to_string(),
            user_id: user_data.id,
            action: "update_password".to_string(),
            name: None,
            email: None,
            password_hash: Some(password_hash),
        };

        let otc_payload_json =
            serde_json::to_string(&otc_payload).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        set_token(&state, &otc_key, &otc_payload_json, OTC_EXPIRATION_SECONDS).await;
    }

    let old_user = match get_user_by_id(&state, &user_data.id).await {
        Ok(user) => user,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let (_, _, email) = old_user;

    let mut template_variables: HashMap<&str, String> = HashMap::new();
    // let mut image_file = File::open("src/static/images/code_image.png").expect("Image file not found");
    let mut image_file = File::open("/app/src/static/images/code_image.png").expect("Image file not found");
    let mut image_data = Vec::new();
    image_file.read_to_end(&mut image_data).expect("Failed to read image");
    let base64_image = BASE64_STANDARD.encode(&image_data);
    let image_data_url = format!("data:image/png;base64,{}", base64_image);
    template_variables.insert("image_url", image_data_url);
    template_variables.insert("header_title", "Account Update Code".to_string());
    template_variables.insert(
        "code_description",
        "Enter this code to confirm you want to update your account".to_string(),
    );
    template_variables.insert("otc", otc.to_string());
    template_variables.insert(
        "link_title",
        "You can also enter this link to confirm your account update".to_string(),
    );
    template_variables.insert("otc_link", format!("http://example.com/confirm/{}", otc));
    template_variables.insert(
        "footer_note",
        "If you did not intend to update your account, please ignore this email.".to_string(),
    );

    let email_body = generate_template(
        VERIFICATION_CODE_TEMPLATE,
        "Confirm account update",
        template_variables,
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if let Err(_) =
        send_email_with_template(&email, "Confirm your account update", &email_body).await
    {
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    Ok(StatusCode::OK)
}

pub async fn delete_user(
    State(state): State<AuthState>,
    Json(user_data): Json<DeleteUser>,
) -> Result<StatusCode, StatusCode> {
    println!("1");
    let formatted_jwt_token = format_jwt_token_key(&user_data.jwt);
    verify_token(&state, &formatted_jwt_token, &user_data.id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let otc = create_otc();
    let otc_key = format_otc_key(&otc);

    let otc_payload = OtcPayload {
        otc: otc.to_string(),
        user_id: user_data.id,
        action: "delete_account".to_string(),
        name: None,
        email: None,
        password_hash: None,
    };

    let otc_payload_json =
        serde_json::to_string(&otc_payload).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    set_token(&state, &otc_key, &otc_payload_json, OTC_EXPIRATION_SECONDS).await;

    let old_user = match get_user_by_id(&state, &user_data.id).await {
        Ok(user) => user,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let (_, _, email) = old_user;

    let mut template_variables: HashMap<&str, String> = HashMap::new();
    // let mut image_file = File::open("src/static/images/code_image.png").expect("Image file not found");
    let mut image_file = File::open("/app/src/static/images/code_image.png").expect("Image file not found");
    let mut image_data = Vec::new();
    image_file.read_to_end(&mut image_data).expect("Failed to read image");
    let base64_image = BASE64_STANDARD.encode(&image_data);
    let image_data_url = format!("data:image/png;base64,{}", base64_image);
    template_variables.insert("image_url", image_data_url);
    template_variables.insert("header_title", "Account Update Code".to_string());
    template_variables.insert(
        "code_description",
        "Enter this code to confirm you want to delete your account".to_string(),
    );
    template_variables.insert("otc", otc.to_string());
    template_variables.insert(
        "link_title",
        "You can also enter this link to delete your account".to_string(),
    );
    template_variables.insert("otc_link", format!("http://example.com/confirm/{}", otc));
    template_variables.insert(
        "footer_note",
        "If you did not intend to delete your account, please ignore this email.".to_string(),
    );

    let email_body = generate_template(
        VERIFICATION_CODE_TEMPLATE,
        "Confirm account deletion",
        template_variables,
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if let Err(_) = send_email_with_template(&email, "Confirm account deletion", &email_body).await
    {
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    Ok(StatusCode::NO_CONTENT)
}
