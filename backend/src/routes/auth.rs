use axum::{
    error_handling::HandleErrorLayer,
    http::StatusCode,
    middleware,
    routing::{delete, patch, post},
    BoxError, Router,
};
use std::time::Duration;
use tower::{buffer::BufferLayer, limit::RateLimitLayer, ServiceBuilder};

use crate::{
    middleware::{jwt::jwt_middleware, language::language_middleware},
    models::auth_models::AuthState,
    services::auth::{
        delete_user, login_user, otc_user, password_reset_request_token, refresh, register_user,
        reset_password_with_token, update_user,
    },
};

pub fn app(state: AuthState) -> Router {
    let routes = Router::new()
        .route("/refresh", post(refresh))
        .route("/register", post(register_user))
        .route("/login", post(login_user))
        .route(
            "/update",
            patch(update_user).layer(middleware::from_fn_with_state(
                state.clone(),
                jwt_middleware,
            )),
        )
        .route(
            "/delete",
            delete(delete_user).layer(middleware::from_fn_with_state(
                state.clone(),
                jwt_middleware,
            )),
        )
        .route("/otc", patch(otc_user))
        .route(
            "/password_reset/request_token",
            post(password_reset_request_token),
        )
        .route("/password_reset", patch(reset_password_with_token))
        .with_state(state)
        .layer(middleware::from_fn(language_middleware))
        .layer(
            ServiceBuilder::new()
                .layer(HandleErrorLayer::new(|err: BoxError| async move {
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        eprintln!("Error creating ServiceBuilder: {}", err),
                    )
                }))
                .layer(BufferLayer::new(1024))
                .layer(RateLimitLayer::new(5, Duration::from_secs(1))),
        );

    routes
}
