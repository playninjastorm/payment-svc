import { SEEDERS, hasSeeder, listSeeders } from "@/seeders";

// Parse flags like --name=value, --name value, -n=value, -n value
function getFlagValue(flags: string[]): string | undefined {
  const argv = Bun.argv.slice(2);

  // --flag=value or -f=value
  for (const flag of flags) {
    const eq = argv.find((a) => a.startsWith(`${flag}=`));
    if (eq) return eq.split("=").slice(1).join("="); // may be ""
  }

  // --flag value or -f value
  for (const flag of flags) {
    const idx = argv.indexOf(flag);
    if (idx !== -1) {
      const next = argv[idx + 1];
      // if next is missing or looks like another flag, treat as empty
      if (!next || next.startsWith("-")) return "";
      return next;
    }
  }

  return undefined;
}

function hasFlag(flag: string): boolean {
  return Bun.argv.slice(2).includes(flag);
}

function printList() {
  const seeds = listSeeders();
  console.log(seeds.map((s) => `- ${s}`).join("\n"));
}

function printHelp(extraError?: string) {
  const seeds = listSeeders();
  const available = seeds.map((s) => `  - ${s}`).join("\n");

  const header = `🌱 Seed runner

Usage:

  bun run seed --name=<namespace:seed>
  bun run seed -n <namespace:seed>
  bun run seed --list

Options:
  --name, -n   Seeder to run (example: products:init)
  --list       List available seeders
  --help, -h   Show this help

Available seeders:
${available}
`;

  if (extraError) {
    console.error(extraError.trimEnd() + "\n");
  }
  console.log(header);
}

async function main() {
  const argv = Bun.argv.slice(2);

  if (argv.length === 0 || hasFlag("--help") || hasFlag("-h")) {
    printHelp();
    process.exit(0);
  }

  if (hasFlag("--list")) {
    printList();
    process.exit(0);
  }

  const name = getFlagValue(["--name", "-n"]);

  // No --name provided at all
  if (name === undefined) {
    printHelp("❌ Missing --name. Use --list to see available seeders.");
    process.exit(1);
  }

  // --name was provided but empty or missing value
  if (name.trim() === "") {
    printHelp(
      "❌ You must choose a seeder name. Use --list to see available seeders.",
    );
    process.exit(1);
  }

  // Seeder doesn't exist
  if (!hasSeeder(name)) {
    printHelp(
      `❌ That seeder does not exist: ${name}\nUse --list to see available seeders.`,
    );
    process.exit(1);
  }

  await SEEDERS[name]();
}

await main();
