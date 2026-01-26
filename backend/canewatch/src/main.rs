
use dotenvy::dotenv;
mod auth;
mod hashing;
mod jwt;
mod login;

fn main() {
    dotenv().ok();
    // println!("Hello, world!");
}
