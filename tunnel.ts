import "dotenv/config";
import { connect } from "node:net";
import ngrok from "@ngrok/ngrok";

const NGROK_AUTHTOKEN = process.env.NGROK_AUTHTOKEN;
const NGROK_DOMAIN = process.env.NGROK_DOMAIN;
const PORT = 3001; // Next.js dev server port
const MAX_RETRIES = 30;
const RETRY_INTERVAL_MS = 2000;

if (!NGROK_AUTHTOKEN) {
  console.error("❌ NGROK_AUTHTOKEN is required in .env");
  process.exit(1);
}

/**
 * Check if a port is accepting connections.
 */
function isPortOpen(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = connect({ port, host: "127.0.0.1" });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => {
      socket.destroy();
      resolve(false);
    });
    socket.setTimeout(1000, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

/**
 * Wait for the frontend to be ready on the given port.
 */
async function waitForServer(port: number): Promise<void> {
  console.log(`⏳ Waiting for frontend on port ${port}...`);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const open = await isPortOpen(port);

    if (open) {
      console.log(`✅ Frontend is ready on port ${port}`);
      return;
    }

    process.stdout.write(
      `   Attempt ${attempt}/${MAX_RETRIES} — port ${port} not open, retrying in ${RETRY_INTERVAL_MS / 1000}s\r`,
    );
    // @ts-ignore - Bun global
    await (typeof Bun !== 'undefined' ? Bun.sleep(RETRY_INTERVAL_MS) : new Promise(r => setTimeout(r, RETRY_INTERVAL_MS)));
  }

  console.error(
    `\n❌ Frontend on port ${port} did not become available after ${MAX_RETRIES} attempts.`,
  );
  console.error(
    `   Make sure to run "bun run dev:web" first, then start the tunnel.`,
  );
  process.exit(1);
}

async function startTunnel() {
  // Wait until the frontend is actually listening
  await waitForServer(PORT);

  console.log("\n🚇 Starting ngrok tunnel...");
  if (NGROK_DOMAIN) {
    console.log(`   Domain: ${NGROK_DOMAIN}`);
  }

  try {
    const listener = await ngrok.forward({
      addr: PORT,
      authtoken: NGROK_AUTHTOKEN,
      domain: NGROK_DOMAIN,
    });

    const url = listener.url();
    console.log("\n✅ ngrok tunnel established!");
    console.log(`   🌐 ${url}\n`);
    console.log(`   LIFF URL    : ${url}`);
    console.log(`   Health      : ${url}/\n`);
    console.log("   Press Ctrl+C to stop.\n");
  } catch (err) {
    console.error("\n❌ Failed to start ngrok tunnel:");
    console.error(`   ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }

  // Keep alive + clean shutdown
  process.on("SIGINT", async () => {
    console.log("\n🛑 Shutting down ngrok tunnel...");
    await ngrok.disconnect();
    process.exit(0);
  });

  await new Promise(() => { });
}

await startTunnel();
