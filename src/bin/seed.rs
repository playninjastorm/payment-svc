use std::{env, future::Future, pin::Pin};

use nkstore::services::products_svc;

// Type alias for a seeder function (always async)
type SeederFn = fn() -> Pin<Box<dyn Future<Output = ()>>>;

// English comment: Macro to wrap an async fn() into a SeederFn
macro_rules! async_seeder {
    ($f:path) => {{
        // English comment: This wrapper does NOT capture anything,
        // so it can be used as a fn pointer in const contexts
        fn wrapper() -> Pin<Box<dyn Future<Output = ()>>> {
            Box::pin($f())
        }
        wrapper as SeederFn
    }};
}

// List of seeders as (name, function)
const SEEDERS: &[(&str, SeederFn)] = &[(
    "init_products",
    async_seeder!(products_svc::seed_products_svc),
)];

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() == 1 {
        print_help();
        return;
    }

    let seeder_name = &args[1];

    match find_seeder(seeder_name) {
        Some(run) => run().await,
        None => {
            println!("❌ Unknown seeder: {}\n", seeder_name);
            print_help();
        }
    }
}

fn find_seeder(name: &str) -> Option<SeederFn> {
    SEEDERS
        .iter()
        .find(|(seeder_name, _)| *seeder_name == name)
        .map(|(_, run)| *run)
}

fn print_help() {
    println!("🌱 Seed runner\n");
    println!("Usage:");
    println!("  cargo run --bin seed -- <seeder_name>\n");
    println!("Available seeders:");

    for (name, _) in SEEDERS {
        println!("  - {}", name);
    }
}
