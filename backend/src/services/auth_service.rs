use crate::models::auth_models::{DeleteUser, LoginResponse, LoginUser, RegisterUser, UpdateUser};
use crate::utils::auth_utils::{encode_jwt, hash_password, verify_password};
use axum::{
    extract::{Json, State},
    http::StatusCode,
};
use sqlx::MySqlPool;

pub async fn register_user(
    State(db): State<MySqlPool>,
    Json(user_data): Json<RegisterUser>,
) -> Result<Json<LoginResponse>, StatusCode> {
    if user_data.password != user_data.password_confirm {
        return Err(StatusCode::BAD_REQUEST);
    }

    let user_exists_query = "SELECT id FROM users WHERE email = ?;";

    let existing_user = sqlx::query(user_exists_query)
        .bind(&user_data.email)
        .fetch_optional(&db)
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

pub async fn login_user(
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

pub async fn update_user(
    State(db): State<MySqlPool>,
    Json(user_data): Json<UpdateUser>,
) -> Result<Json<LoginResponse>, StatusCode> {
    println!("Starting update...");

    // Handle updating email and name if both are present
    if let (Some(email), Some(name)) = (&user_data.email, &user_data.name) {
        println!("Updating email and name for user with ID: {}", &user_data.id);

        let update_user_query = r#"
        UPDATE users 
        SET email = ?, name = ?
        WHERE id = ?;
        "#;

        // Unwrap email and name as they are `Option<String>`
        sqlx::query(update_user_query)
            .bind(email)  // Unwrapped email
            .bind(name)   // Unwrapped name
            .bind(&user_data.id)  // User ID
            .execute(&db)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        println!("Updated email and name.");
    }

    // Handle updating the password if both password and password_confirm are present
    if let (Some(password), Some(password_confirm)) = (&user_data.password, &user_data.password_confirm) {
        if password != password_confirm {
            return Err(StatusCode::BAD_REQUEST);
        }

        // Hash the password
        let password_hash = match hash_password(password) {
            Ok(hash) => hash,
            Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
        };

        let password_update_query = r#"
        UPDATE users 
        SET password_hash = ?
        WHERE id = ?;
        "#;

        sqlx::query(password_update_query)
            .bind(password_hash)  // Bind the hashed password
            .bind(&user_data.id)  // User ID
            .execute(&db)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        println!("Password updated.");
    }

    println!("Fetching updated user data...");

    // Fetch the updated user information after updates
    let select_user_query = "SELECT id, name, email FROM users WHERE id = ?;";

    let updated_user = sqlx::query_as::<_, (i32, String, String)>(select_user_query)
        .bind(&user_data.id)  // Bind user ID to the query
        .fetch_one(&db)  // Fetch the updated user info
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let (id, name, email) = updated_user;

    // Generate a JWT token
    let token = encode_jwt(&email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    println!("Returning updated user response...");

    // Construct the response
    let response = LoginResponse {
        id,
        token,
        name,
        email,
    };

    Ok(Json(response))  // Return the response
}

pub async fn delete_user(
    State(db): State<MySqlPool>,
    Json(user_data): Json<DeleteUser>,
) -> Result<StatusCode, StatusCode> {
    let delete_query = r#"
    DELETE FROM users 
    WHERE id = ?;
    "#;

    sqlx::query(delete_query)
        .bind(&user_data.id)
        .execute(&db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}
