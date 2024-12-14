use axum::{
    middleware,
    routing::{delete, patch, post},
    Router,
};
use std::time::Duration;
use tower::{buffer::BufferLayer, limit::RateLimitLayer, ServiceBuilder};

use crate::{
    middleware::{jwt_middleware::jwt_middleware, language_middleware::language_middleware},
    models::auth_models::AuthState,
    services::auth_service::{delete_user, login_user, otc_user, register_user, update_user},
};
use axum::{error_handling::HandleErrorLayer, http::StatusCode, BoxError};

pub fn app(state: AuthState) -> Router {
    let routes = Router::new()
        .route("/register", post(register_user))
        .route("/login", post(login_user))
        .route("/update", patch(update_user))
        .route(
            "/delete",
            delete(delete_user).layer(middleware::from_fn_with_state(
                state.clone(),
                jwt_middleware,
            )),
        )
        .route("/otc", patch(otc_user))
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
