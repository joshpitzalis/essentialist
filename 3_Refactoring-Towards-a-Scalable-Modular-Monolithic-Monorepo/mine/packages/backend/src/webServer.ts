import { exec } from "child_process";
import cors from "cors";
import express from "express";
import { Server } from "http";

interface WebServerConfig {
  port: number;
  env: string;
}

export class WebServer {
  private express: express.Express;
  private state: "stopped" | "started";
  private instance: Server | undefined;

  constructor(private config: WebServerConfig) {
    this.state = "stopped";
    this.express = express();
    this.initializeServer();
  }

  private initializeServer() {
    this.addMiddlewares();
    this.express.use(cors());
  }

  private addMiddlewares() {
    this.express.use(express.json());
  }

  public mountRouter(path: string, router: express.Router) {
    this.express.use(path, router);
  }

  public getApplication() {
    return this.express;
  }

  async start(): Promise<void> {
    return new Promise((resolve, _reject) => {
      ProcessService.killProcessOnPort(this.config.port, () => {
        if (this.config.env === "test") {
          resolve();
          return;
        }
        console.log("Starting the server");
        this.instance = this.express.listen(this.config.port, () => {
          console.log(`Server is running on port ${this.config.port}`);
          this.state = "started";
          resolve();
        });
      });
    });
  }

  async stop() {
    return new Promise((resolve, reject) => {
      if (!this.instance) {
        this.state = "stopped";
        return resolve("Server not started");
      }
      this.instance.close((err) => {
        if (err) return reject("Error stopping the server");
        this.state = "stopped";
        this.instance = undefined;
        return resolve("Server stopped");
      });
    });
  }

  isStarted() {
    return this.state === "started";
  }
}

export class ProcessService {
  public static killProcessOnPort(port: number, cb: any) {
    const killCommand =
      process.platform === "win32"
        ? `netstat -ano | findstr :${port} | findstr LISTENING`
        : `lsof -i:${port} -t`;

    exec(killCommand, (error: any, stdout: any, stderr: any) => {
      if (error) {
        // console.error(`Failed to execute the command: ${error.message}`);
        return cb ? cb() : "";
      }

      if (stderr) {
        // console.error(`Command execution returned an error: ${stderr}`);
        return cb ? cb() : "";
      }

      const processId = stdout.trim();
      if (processId) {
        const killProcessCommand =
          process.platform === "win32"
            ? `taskkill /F /PID ${processId}`
            : `kill ${processId}`;

        exec(killProcessCommand, (error: any, _stdout: any, _stderr: any) => {
          if (error) {
            // console.error(`Failed to kill the process: ${error.message}`);
            return cb ? cb() : "";
          }
          // console.log(`Process running on port ${port} has been killed.`);
          return cb ? cb() : "";
        });
      } else {
        // console.log(`No process found running on port ${port}.`);
        return cb ? cb() : "";
      }
    });
  }
}
