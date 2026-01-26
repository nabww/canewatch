use serde::{Deserialize, Serialize};

/// Request payload for user registration
#[derive(Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
    pub username: Option<String>,
}

/// Request payload for user login
#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

/// Response returned after successful authentication
#[derive(Serialize)]
pub struct AuthResponse {
    pub access_token: String,
}
