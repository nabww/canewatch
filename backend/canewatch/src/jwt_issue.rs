use jsonwebtoken::{encode, Header, EncodingKey};
use chrono::{Utc, Duration};
use serde::{Serialize};

#[derive(Serialize)]
struct Claims {
    sub: String,
    exp: usize,
}

pub fn create_jwt(user_id: &str, secret: &str, minutes: i64) -> String {
    let exp = (Utc::now() + Duration::minutes(minutes)).timestamp() as usize;
    let claims = Claims {
        sub: user_id.to_string(),
        exp,
    };

    encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_bytes()))
        .unwrap()
}
