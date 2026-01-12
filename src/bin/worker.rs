use log::info;
use tokio::time::{Duration, interval};

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    env_logger::init();

    info!("Worker started");

    let mut ticker = interval(Duration::from_secs(10));

    loop {
        tokio::select! {
            _ = ticker.tick() =>{
                info!("Hello world");
            }

            _ = tokio::signal::ctrl_c() => {
                info!("Shutting down worker");
                break;
            }
        }
    }

    info!("Worker stopped");
}
