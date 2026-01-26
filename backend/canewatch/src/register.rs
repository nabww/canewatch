use axum::{extract::State, Json};
use sqlx::MySqlPool;
use uuid::Uuid;
use crate::auth::{RegisterRequest, AuthResponse};
use crate::hashing::hash_password;
use crate::jwt::create_jwt;

pub async fn register(
    State(pool): State<MySqlPool>,
    Json(payload): Json<RegisterRequest>,
) -> Json<AuthResponse> {
    let user_id = Uuid::new_v4();
    let hashed = hash_password(&payload.password);

    sqlx::query!(
        "INSERT INTO users (id, email, password_hash, username) VALUES (UUID_TO_BIN(?), ?, ?, ?)",
        user_id.to_string(),
        payload.email,
        hashed,
        payload.username
    )
        .execute(&pool)
        .await
        .unwrap();

    let token = create_jwt(
        &user_id.to_string(),
        &std::env::var("JWT_SECRET").unwrap(),
        std::env::var("JWT_EXP_MINUTES").unwrap().parse().unwrap(),
    );

    Json(AuthResponse { access_token: token })
}
