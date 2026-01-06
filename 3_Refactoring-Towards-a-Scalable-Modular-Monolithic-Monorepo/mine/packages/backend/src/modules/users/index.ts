import { Database } from "../../database";
import { WebServer } from "../../webServer";
import { TransactionalEmailAPI } from "../notifications/transactionalEmailAPI";
import { UsersController } from "./usersController";
import { userErrorHandler } from "./usersErrors";
import { UsersService } from "./usersService";

export class UsersModule {
  private usersService: UsersService;
  private usersController: UsersController;

  private constructor(
    private dbConnection: Database,
    private emailAPI: TransactionalEmailAPI
  ) {
    this.usersService = this.createUsersService();
    this.usersController = this.createUsersController();
  }

  static build(dbConnection: Database, emailAPI: TransactionalEmailAPI) {
    return new UsersModule(dbConnection, emailAPI);
  }

  private createUsersService() {
    return new UsersService(this.dbConnection, this.emailAPI);
  }

  private createUsersController() {
    return new UsersController(this.usersService, userErrorHandler);
  }

  public getController() {
    return this.usersController;
  }

  public mountRouter(webServer: WebServer) {
    webServer.mountRouter("/users", this.usersController.getRouter());
  }
}
