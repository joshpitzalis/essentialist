import { CompositionRoot, Config } from "./root";

const config = new Config("start");

const composition = CompositionRoot.createCompositionRoot(config);
const webServer = composition.getWebServer();
const dbConnection = composition.getDBConnection();

export async function start() {
  await dbConnection.connect();
  await webServer.start();
}

export const app = webServer.getApplication();
export const database = dbConnection;

start();
