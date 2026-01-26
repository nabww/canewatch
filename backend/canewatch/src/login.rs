use axum::{extract::State, Json};
use sqlx::MySqlPool;
use crate::auth::{AuthResponse, LoginRequest};
use crate::hashing::verify_password;
use crate::jwt::create_jwt;

pub async fn login(
    State(pool): State<MySqlPool>,
    Json(payload): Json<LoginRequest>,
) -> Json<AuthResponse> {
    let record = sqlx::query!(
        "SELECT BIN_TO_UUID(id) as id, password_hash
         FROM users WHERE email = ?",
        payload.email
    )
        .fetch_one(&pool)
        .await
        .unwrap();

    if !verify_password(&record.password_hash, &payload.password) {
        panic!("Invalid credentials");
    }

    let token = create_jwt(
        &record.id.unwrap(),
        &std::env::var("JWT_SECRET").unwrap(),
        std::env::var("JWT_EXP_MINUTES").unwrap().parse().unwrap(),
    );

    Json(AuthResponse { access_token: token })
}
