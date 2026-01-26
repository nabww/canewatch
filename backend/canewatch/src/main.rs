use axum::{routing::post, Router};
use dotenvy::dotenv;
use sqlx::MySqlPool;
use std::env;
use tokio::net::TcpListener;

mod auth;
mod hashing;
mod jwt;
mod login;
mod register;

#[tokio::main]
async fn main() {
    dotenv().ok();

    // Connect to database
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = MySqlPool::connect(&database_url)
        .await
        .expect("Failed to connect to DB");

    // Build router
    let app = Router::new()
        .route("/auth/login", post(login::login))
        .route("/auth/register", post(register::register))
        .with_state(pool);

    // Explicit type annotation for TcpListener
    let listener: TcpListener = TcpListener::bind("127.0.0.1:3000")
        .await
        .expect("Failed to bind TCP listener");

    println!("Server running at http://127.0.0.1:3000");

    axum::serve(listener, app).await.unwrap();
}
