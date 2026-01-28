import { Database } from "@dddforum/backend/src/shared/database";
import type { User } from "@dddforum/shared/src/api/users";
import type { TransactionalEmailAPI } from "../notifications/transactionalEmailAPI";
import type { UsersRepository } from "./ports/userRepo";
import type { CreateUserCommand } from "./usersCommand";
import {
	EmailAlreadyInUseException,
	UserNotFoundException,
	UsernameAlreadyTakenException,
} from "./usersExceptions";

export class UsersService {
	// constructor(
	//   private db: Database,
	//   private emailAPI: TransactionalEmailAPI,
	// ) {}

	constructor(
		private repository: UsersRepository, // This should be done
		private emailAPI: TransactionalEmailAPI, // This is next
	) {}

	async createUser(userData: CreateUserCommand): Promise<User> {
		const existingUserByEmail = await this.repository.findUserByEmail(
			userData.email,
		);
		if (existingUserByEmail) {
			throw new EmailAlreadyInUseException(userData.email);
		}

		const existingUserByUsername = await this.repository.findUserByUsername(
			userData.username,
		);
		if (existingUserByUsername) {
			throw new UsernameAlreadyTakenException(userData.username);
		}

		const { password, ...user } = await this.repository.save(userData);

		await this.emailAPI.sendMail({
			to: user.email,
			subject: "Your login details to DDDForum",
			text: `Welcome to DDDForum. You can login with the following details </br>
      email: ${user.email}
      password: ${password}`,
		});

		return user;
	}

	async getUserByEmail(email: string) {
		const user = await this.repository.findUserByEmail(email);
		if (!user) {
			throw new UserNotFoundException(email);
		}
		return user;
	}
}
