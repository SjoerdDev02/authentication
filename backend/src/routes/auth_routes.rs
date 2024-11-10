use axum::{
    middleware,
    routing::{delete, patch, post},
    Router,
};

use crate::{
    middleware::jwt_middleware::jwt_middleware,
    models::auth_models::AuthState,
    services::auth_service::{delete_user, login_user, otc_user, register_user, update_user},
};

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
        .with_state(state);

    return routes;
}
