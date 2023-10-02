import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { AppError } from "@shared/errors/AppError";
import { AuthtenticateUserUseCase } from "./AuthtenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let authenticateUserUseCase: AuthtenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthtenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      driver_license: "00123",
      email: "user@test.com",
      name: "user tes",
      password: "123456",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate an non-existent user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "false@test.com",
        password: "123456",
      })
    ).rejects.toEqual(new AppError("Email or password incorrect"));
  });

  it("should not be able to authenticate with incorrect password", async () => {
    const user: ICreateUserDTO = {
      driver_license: "999",
      email: "user@user.com",
      name: "user creep password",
      password: "1234",
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "4321",
      })
    ).rejects.toEqual(new AppError("Email or password incorrect"));
  });
});
