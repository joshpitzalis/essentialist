import { MarketingModule } from "@question-scraper/backend/src/modules/marketing/index";
import { NotificationsModule } from "@question-scraper/backend/src/modules/notifications/index";
import { UsersModule } from "@question-scraper/backend/src/modules/users/index";
import { Database } from "./database";
import { WebServer } from "./webServer";

export class CompositionRoot {
  private static instance: CompositionRoot | null = null;

  private webServer: WebServer;
  private dbConnection: Database;
  private config: Config;

  private usersModule: UsersModule;
  private marketingModule: MarketingModule;

  private notificationsModule: NotificationsModule;

  public static createCompositionRoot(config: Config) {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new this(config);
    }
    return CompositionRoot.instance;
  }

  private constructor(config: Config) {
    this.config = config;
    this.dbConnection = this.createDBConnection();
    this.notificationsModule = this.createNotificationsModule();
    this.marketingModule = this.createMarketingModule();
    this.usersModule = this.createUsersModule();

    this.webServer = this.createWebServer();
    this.mountRoutes();
  }

  createNotificationsModule() {
    return NotificationsModule.build();
  }

  createMarketingModule() {
    return MarketingModule.build();
  }

  createUsersModule() {
    return UsersModule.build(
      this.dbConnection,
      this.notificationsModule.getTransactionalEmailAPI()
    );
  }

  getDBConnection() {
    if (!this.dbConnection) this.createDBConnection();
    return this.dbConnection;
  }

  createWebServer() {
    return new WebServer({ port: 3000, env: this.config.env });
  }

  getWebServer() {
    return this.webServer;
  }

  private mountRoutes() {
    this.marketingModule.mountRouter(this.webServer);
    this.usersModule.mountRouter(this.webServer);
  }

  private createDBConnection() {
    const dbConnection = new Database();
    if (!this.dbConnection) {
      this.dbConnection = dbConnection;
    }
    return dbConnection;
  }
}

// // ###

// import { NextFunction, Request, Response } from "express";
// import { prisma } from "./database";
// import { ContactListAPI } from "./modules/marketing/contactListAPI";
// import { CustomException } from "./modules/marketing/errors";
// import { MarketingController } from "./modules/marketing/marketingController";
// import { MarketingService } from "./modules/marketing/marketingService";

// const cors = require("cors");
// export const app = express();

// app.use(express.json());
// app.use(cors());

// // Mount marketing module
// const contactListAPI = new ContactListAPI();
// const marketingService = new MarketingService(contactListAPI);

// export const errorHandler = (
//   error: CustomException,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   return res
//     .status(500)
//     .json({ success: false, data: null, error: { code: "ServerError" } });
// };

// const marketingController = new MarketingController(
//   marketingService,
//   errorHandler
// );

// app.use("/marketing", marketingController.getRouter());

// const Errors = {
//   UsernameAlreadyTaken: "UserNameAlreadyTaken",
//   EmailAlreadyInUse: "EmailAlreadyInUse",
//   ValidationError: "ValidationError",
//   ServerError: "ServerError",
//   ClientError: "ClientError",
//   UserNotFound: "UserNotFound",
// };

// // Create a new user
// app.post("/users/new", async (req: Request, res: Response) => {
//   try {
//     const keyIsMissing = isMissingKeys(req.body, [
//       "email",
//       "firstName",
//       "lastName",
//       "username",
//     ]);

//     if (keyIsMissing) {
//       return res.status(400).json({
//         error: Errors.ValidationError,
//         data: undefined,
//         success: false,
//       });
//     }

//     const userData = req.body;

//     const existingUserByEmail = await prisma.user.findFirst({
//       where: { email: req.body.email },
//     });
//     if (existingUserByEmail) {
//       return res.status(409).json({
//         error: Errors.EmailAlreadyInUse,
//         data: undefined,
//         success: false,
//       });
//     }

//     const existingUserByUsername = await prisma.user.findFirst({
//       where: { username: req.body.username as string },
//     });
//     if (existingUserByUsername) {
//       return res.status(409).json({
//         error: Errors.UsernameAlreadyTaken,
//         data: undefined,
//         success: false,
//       });
//     }

//     const { user, member } = await prisma.$transaction(async (tx: any) => {
//       const user = await prisma.user.create({
//         data: { ...userData, password: generateRandomPassword(10) },
//       });
//       const member = await prisma.member.create({ data: { userId: user.id } });
//       return { user, member };
//     });

//     return res.status(201).json({
//       error: undefined,
//       data: parseUserForResponse(user),
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//     // Return a failure error response
//     return res
//       .status(500)
//       .json({ error: Errors.ServerError, data: undefined, success: false });
//   }
// });

// // Get a user by email
// app.get("/users", async (req: Request, res: Response) => {
//   try {
//     const email = req.query.email as string;
//     if (email === undefined) {
//       return res.status(400).json({
//         error: Errors.ValidationError,
//         data: undefined,
//         success: false,
//       });
//     }

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ error: Errors.UserNotFound, data: undefined, success: false });
//     }

//     return res.status(200).json({
//       error: undefined,
//       data: parseUserForResponse(user),
//       succes: true,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ error: Errors.ServerError, data: undefined, success: false });
//   }
// });

// // Get posts
// app.get("/posts", async (req: Request, res: Response) => {
//   try {
//     const { sort } = req.query;

//     if (sort !== "recent") {
//       return res
//         .status(400)
//         .json({ error: Errors.ClientError, data: undefined, success: false });
//     }

//     let postsWithVotes = await prisma.post.findMany({
//       include: {
//         votes: true, // Include associated votes for each post
//         memberPostedBy: {
//           include: {
//             user: true,
//           },
//         },
//         comments: true,
//       },
//       orderBy: {
//         dateCreated: "desc", // Sorts by dateCreated in descending order
//       },
//     });

//     return res.json({
//       error: undefined,
//       data: { posts: postsWithVotes },
//       success: true,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ error: Errors.ServerError, data: undefined, success: false });
//   }
// });
// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// prisma.post
//   .findMany({})
//   .then((posts: any) => console.log(posts))
//   .catch((err: any) => console.log(err));

export type Environment = "development" | "production" | "staging" | "ci";

export type Script = "test:unit" | "test:e2e" | "start" | "test:infra";

export class Config {
  env: Environment;
  script: Script;

  constructor(script: Script) {
    this.env = (process.env.NODE_ENV as Environment) || "development";
    this.script = script;
  }
}
