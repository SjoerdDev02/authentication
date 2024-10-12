use crate::constants::auth_constants::JWT_EXPIRATION_SECONDS;
use crate::models::auth_models::{
    AuthResponse, AuthState, DeleteUser, LoginUser, RegisterUser, UpdateUser,
};
use crate::utils::auth_utils::{
    create_user, delete_user_by_id, encode_jwt, format_jwt_token_key, get_user_by_email,
    get_user_by_id, update_user_email_and_name, update_user_password, verify_password,
};
use crate::utils::redis_utils::{get_token, set_token};
use axum::{
    extract::{Json, State},
    http::StatusCode,
};

pub async fn register_user(
    State(state): State<AuthState>,
    Json(user_data): Json<RegisterUser>,
) -> Result<Json<AuthResponse>, StatusCode> {
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

    let jwt_key = format_jwt_token_key(&id);
    let token = encode_jwt(&user_data.email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    set_token(&state, &jwt_key, &token, JWT_EXPIRATION_SECONDS).await;

    let response = AuthResponse {
        id,
        token,
        name,
        email,
    };

    Ok(Json(response))
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

    let jwt_key = format_jwt_token_key(&id);
    let token = encode_jwt(&user_data.email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    set_token(&state, &jwt_key, &token, JWT_EXPIRATION_SECONDS).await;

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
) -> Result<Json<AuthResponse>, StatusCode> {
    if let (Some(email), Some(name)) = (&user_data.email, &user_data.name) {
        update_user_email_and_name(&state, &user_data.id, name, email)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    }

    if let (Some(password), Some(password_confirm)) =
        (&user_data.password, &user_data.password_confirm)
    {
        update_user_password(&state, &user_data.id, password, password_confirm)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    }

    let updated_user = match get_user_by_id(&state, &user_data.id).await {
        Ok(user) => user,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let (id, name, email) = updated_user;

    let token = encode_jwt(&email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let response = AuthResponse {
        id,
        token,
        name,
        email,
    };

    Ok(Json(response))
}

pub async fn delete_user(
    State(state): State<AuthState>,
    Json(user_data): Json<DeleteUser>,
) -> Result<StatusCode, StatusCode> {
    let token = match get_token(&state, &user_data.id).await {
        Ok(Some(token)) => token,
        Ok(None) => return Err(StatusCode::UNAUTHORIZED),
        Err(_) => return Err(StatusCode::UNAUTHORIZED),
    };

    if token != user_data.jwt {
        return Err(StatusCode::UNAUTHORIZED);
    }

    delete_user_by_id(&state, &user_data.id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}
