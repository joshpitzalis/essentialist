// import { prisma } from "@question-scraper/backend/src/database";
import { Database } from "@question-scraper/backend/src/database";
import { CompositionRoot, Config } from "@question-scraper/backend/src/root";
import { WebServer } from "@question-scraper/backend/src/webServer";
import {
  CreateUserParams,
  createUsersAPI,
} from "@question-scraper/shared/src/api/users";
import { DatabaseFixture } from "@question-scraper/shared/tests/support/fixtures/databaseFixture";
import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import request from "supertest";
import { sharedTestRoot } from "../../../shared/src/paths";
import {
  CreateUserInput,
  CreateUserInputBuilder,
} from "../../../shared/tests/support/builders/createUserBuilder";

const feature = loadFeature(
  path.join(sharedTestRoot, "features/registration.feature")
);

defineFeature(feature, (test) => {
  let createUserResponse: any = {};
  let addEmailToListResponse: any = {};
  let createUserInput: Partial<CreateUserInput>;
  let createUserResponses: (typeof createUserResponse)[] = [];
  // let dbFixture: DatabaseFixture;

  let dbFixture: DatabaseFixture;

  let composition: CompositionRoot;
  let server: WebServer;
  let app: any;
  const config: Config = new Config("test:e2e");

  // let addEmailToListResponse: AddEmailToListResponse;
  let dbConnection: Database;
  let userApi: ReturnType<typeof createUsersAPI> = {} as any;

  beforeAll(async () => {
    // dbFixture = new DatabaseFixture(prisma);
    CompositionRoot.resetInstance();
    composition = CompositionRoot.createCompositionRoot(config);
    server = composition.getWebServer();
    app = server.getApplication();
    dbFixture = new DatabaseFixture();
    dbConnection = composition.getDBConnection();

    await server.start();
    await dbConnection.connect();
    userApi = createUsersAPI("http://localhost:3000");
  });

  afterEach(async () => {
    await dbFixture.resetDatabase();
    createUserResponse = {};
    addEmailToListResponse = {};
    createUserInput = {};
    createUserResponses = [];
  });

  afterAll(async () => {
    await server.stop();
  });

  test("Successful registration with marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    given("I am a new user", async () => {
      createUserInput = await new CreateUserInputBuilder()
        .withAllRandomDetails()
        .build();
    });

    when(
      "I register with valid account details accepting marketing emails",
      async () => {
        // createUserResponse = await request(app)
        //   .post("/users/new")
        //   .send(createUserInput);

        createUserResponse = await userApi.register(createUserInput);

        addEmailToListResponse = await request(app)
          .post("/marketing/new")
          .send({ email: createUserInput.email });
      }
    );

    then("I should be granted access to my account", () => {
      const { data, success, error } = createUserResponse;

      // Result Verification
      expect(success).toBeTruthy();
      expect(data!.id).toBeDefined();
      expect(data!.email).toEqual(createUserInput.email);
      expect(data!.firstName).toEqual(createUserInput.firstName);
      expect(data!.lastName).toEqual(createUserInput.lastName);
      expect(data!.username).toEqual(createUserInput.username);
    });

    and("I should expect to receive marketing emails", () => {
      const { success } = addEmailToListResponse.body;
      expect(addEmailToListResponse.status).toBe(201);
      expect(success).toBeTruthy();
    });
  });

  test("Successful registration without marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    given("I am a new user", async () => {
      createUserInput = await new CreateUserInputBuilder()
        .withAllRandomDetails()
        .build();
    });

    when(
      "I register with valid account details declining marketing emails",
      async () => {
        createUserResponse = await request(app)
          .post("/users/new")
          .send(createUserInput);
      }
    );

    then("I should be granted access to my account", () => {
      const { data, success, error } = createUserResponse.body;

      // Result Verification
      expect(success).toBeTruthy();
      expect(createUserResponse.status).toBe(201);
      expect(data!.id).toBeDefined();
      expect(data!.email).toEqual(createUserInput.email);
      expect(data!.firstName).toEqual(createUserInput.firstName);
      expect(data!.lastName).toEqual(createUserInput.lastName);
      expect(data!.username).toEqual(createUserInput.username);
    });

    and("I should not expect to receive marketing emails", () => {
      // Verify the marketing endpoint was never called
      expect(addEmailToListResponse).toEqual({});
      expect(createUserResponse.status).toBe(201);
    });
  });

  test("Invalid or missing registration details", ({
    given,
    when,
    then,
    and,
  }) => {
    given("I am a new user", async () => {
      createUserInput = { email: "invalid input" };
    });

    when("I register with invalid account details", async () => {
      createUserResponse = await request(app)
        .post("/users/new")
        .send(createUserInput);
    });

    then("I should see an error notifying me that my input is invalid", () => {
      expect(createUserResponse.success).toBe(undefined);
      expect(createUserResponse.data).toBeUndefined();
      expect(createUserResponse.error).toBeDefined();
    });

    and("I should not have been sent access to account details", () => {
      expect(createUserResponse.success).toBe(undefined);
      expect(createUserResponse.data).toBeUndefined();
      expect(createUserResponse.error).toBeDefined();
    });
  });

  test("Account already created with email", ({ given, when, then, and }) => {
    let existingUsers: CreateUserParams[] = [];

    given("a set of users already created accounts", async (table) => {
      existingUsers = table.map((row: any) => {
        return new CreateUserInputBuilder()
          .withFirstName(row.firstName)
          .withLastName(row.lastName)
          .withEmail(row.email)
          .build();
      });

      await dbFixture.setupWithExistingUsers(existingUsers);
    });

    when("new users attempt to register with those emails", async (table) => {
      createUserResponses = await Promise.all(
        existingUsers.map((user) => {
          return request(app).post("/users/new").send(user);
        })
      );
    });

    then(
      "they should see an error notifying them that the account already exists",
      () => {
        for (const response of createUserResponses) {
          expect(response.body.error).toBeDefined();
          expect(response.body.success).toBeFalsy();
          expect(response.body.error.code).toEqual("EmailAlreadyInUse");
        }
      }
    );

    and("they should not have been sent access to account details", () => {
      createUserResponses.forEach((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.data).toBeNull();
        expect(response.body.error).toBeDefined();
      });
    });
  });

  test.skip("Username already taken", ({ given, when, then, and }) => {
    given(
      "a set of users have already created their accounts with valid details",
      (table) => {}
    );

    when(
      "new users attempt to register with already taken usernames",
      (table) => {}
    );

    then(
      "they see an error notifying them that the username has already been taken",
      () => {
        expect(true).toBe(false);
      }
    );

    and("they should not have been sent access to account details", () => {});
  });
});
