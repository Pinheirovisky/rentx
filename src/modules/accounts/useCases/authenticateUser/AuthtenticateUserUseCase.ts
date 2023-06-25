import { inject, injectable } from "tsyringe";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../errors/AppError";

interface IRequest {
    email: string;
    password: string;
}

interface IReponse {
    user: {
        name: string;
        email: string;
    };
    token: string;
}

@injectable()
class AuthtenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute({ email, password }: IRequest): Promise<IReponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError("Email or password incorrect");
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new AppError("Email or password incorrect");
        }

        const token = sign({}, "19ebd1e70451add04bc90703f5b70dc0", {
            subject: user.id,
            expiresIn: "1d",
        });

        const tokenReturn: IReponse = {
            user: {
                email,
                name: user.name,
            },
            token,
        };

        return tokenReturn;
    }
}

export { AuthtenticateUserUseCase };
