use std::env;

use nkstore::services::products;

// Type alias for a seeder function
type SeederFn = fn();

// List of seeders as (name, function)
const SEEDERS: &[(&str, SeederFn)] = &[("init_products", products::service::seed_products)];

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() == 1 {
        print_help();
        return;
    }

    let seeder_name = &args[1];

    match find_seeder(seeder_name) {
        Some(run) => run(),
        None => {
            println!("❌ Unknown seeder: {}\n", seeder_name);
            print_help();
        }
    }
}

fn find_seeder(name: &str) -> Option<SeederFn> {
    // English comment: search seeder by name
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
