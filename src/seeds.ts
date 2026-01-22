import { SEEDERS, type SeederName } from "./seeders";

function getFlagValue(flag: string): string | undefined {
  const argv = Bun.argv.slice(2);

  const eq = argv.find((a) => a.startsWith(`${flag}=`));
  if (eq) return eq.split("=").slice(1).join("=") || undefined;

  const idx = argv.indexOf(flag);
  if (idx !== -1) return argv[idx + 1];

  return undefined;
}

function printHelp() {
  const available = Object.keys(SEEDERS);

  console.log(`🌱 Seed runner

Usage:

  bun run seed --name=<seeder_name>

Available seeders:
${available.map((s) => `  - ${s}`).join("\n")}
`);
}

function isSeederName(name: string): name is SeederName {
  return Object.prototype.hasOwnProperty.call(SEEDERS, name);
}

async function main() {
  const argv = Bun.argv.slice(2);

  // No args => help
  if (argv.length === 0) {
    printHelp();
    process.exit(0);
  }

  const name = getFlagValue("--name");

  if (!name) {
    printHelp();
    process.exit(1);
  }

  if (!isSeederName(name)) {
    console.error(`❌ Unknown seeder: ${name}\n`);
    printHelp();
    process.exit(1);
  }

  await SEEDERS[name]();
}

await main();
