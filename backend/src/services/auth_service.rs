use crate::models::auth_models::{LoginResponse, LoginUser, RegisterUser, UpdateUser};
use crate::utils::auth_utils::{encode_jwt, hash_password, verify_password};
use axum::{
    extract::{Json, State},
    http::StatusCode,
};
use sqlx::MySqlPool;

pub async fn register(
    State(db): State<MySqlPool>,
    Json(user_data): Json<RegisterUser>,
) -> Result<Json<LoginResponse>, StatusCode> {
    if user_data.password != user_data.password_confirm {
        return Err(StatusCode::BAD_REQUEST);
    }

    let user_exists_query = "SELECT id FROM users WHERE email = ?;";

    let existing_user = sqlx::query(user_exists_query)
    .bind(&user_data.email)
    .fetch_optional(&db) // Use fetch_optional to handle 0 or 1 result
    .await
    .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR))?;

    if existing_user.is_some() {
        return Err(StatusCode::CONFLICT);
    }

    let password_hash = match hash_password(&user_data.password) {
        Ok(hash) => hash,
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let create_user_query = r#"
        INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)
    "#;

    let result = sqlx::query(create_user_query)
        .bind(&user_data.name)
        .bind(&user_data.email)
        .bind(&password_hash)
        .execute(&db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let user_id = result.last_insert_id();

    let select_user_query = "SELECT id, name, email FROM users WHERE id = ?;";

    let user = sqlx::query_as::<_, (i32, String, String)>(select_user_query)
        .bind(&user_id)
        .fetch_one(&db)
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    let (id, name, email) = user;

    let token = encode_jwt(&user_data.email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let response = LoginResponse {
        id,
        token,
        name,
        email,
    };

    Ok(Json(response))
}

pub async fn login(
    State(db): State<MySqlPool>,
    Json(user_data): Json<LoginUser>,
) -> Result<Json<LoginResponse>, StatusCode> {
    let user_query = "SELECT id, name, email, password_hash FROM users WHERE email = ?;";

    let user = sqlx::query_as::<_, (i32, String, String, String)>(user_query)
        .bind(&user_data.email)
        .fetch_one(&db)
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    let (id, name, email, password_hash) = user;

    if !verify_password(&user_data.password, &password_hash)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let token = encode_jwt(&email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let response = LoginResponse {
        id,
        token,
        name,
        email,
    };

    Ok(Json(response))
}

pub async fn update(
    State(db): State<MySqlPool>,
    Json(user_data): Json<UpdateUser>,
) -> Result<Json<LoginResponse>, StatusCode> {
    let mut updated_user;

    // Update name and email if provided
    if !user_data.email.is_empty() && !user_data.name.is_empty() {
        let user_query = r#"
        UPDATE users 
        SET email = ?, name = ?
        WHERE id = ?;
        "#;

        updated_user = sqlx::query_as::<_, (i32, String, String, String)>(user_query)
            .bind(&user_data.email)
            .bind(&user_data.name)
            .bind(&user_data.id)
            .execute(&db)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    }

    // Check and update the password if fields are provided
    if !user_data.previous_password.is_empty() && !user_data.password.is_empty() && !user_data.password_confirm.is_empty() {
        let previous_password_hash_query = "SELECT password_hash FROM users WHERE id = ?;";

        let previous_password_hash = sqlx::query(previous_password_hash_query)
            .bind(&user_data.id)
            .fetch_one(&db)
            .await
            .map_err(|_| StatusCode::UNAUTHORIZED)?;

        if !verify_password(&user_data.previous_password, &previous_password_hash.password_hash)
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)? {
            return Err(StatusCode::UNAUTHORIZED);
        }

        // Ensure new passwords match
        if user_data.password != user_data.password_confirm {
            return Err(StatusCode::BAD_REQUEST);
        }

        // Hash the new password
        let password_hash = match hash_password(&user_data.password) {
            Ok(hash) => hash,
            Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
        };

        // Update password hash in database
        let password_update_query = r#"
        UPDATE users 
        SET password_hash = ?
        WHERE id = ?;
        "#;

        updated_user = sqlx::query_as::<_, (i32, String, String, String)>(password_update_query)
            .bind(password_hash)
            .bind(&user_data.id)
            .execute(&db)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    }

    // Generate a new JWT token after the update
    let token = encode_jwt(&user_data.email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Return updated user info along with the token
    let response = LoginResponse {
        id: user_data.id,
        token,
        name: user_data.name.clone(),
        email: user_data.email.clone(),
    };

    Ok(Json(response))
}

pub async fn delete(
    State(db): State<MySqlPool>,
    Json(user_id: i32): Json<i32>,
    // Path(user_id): Path<i32>,
) -> Result<StatusCode, StatusCode> {
    let delete_query = r#"
    DELETE FROM users 
    WHERE id = ?;
    "#;

    sqlx::query(delete_query)
        .bind(user_id)
        .execute(&db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}