import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthtenticateUserUseCase } from "./AuthtenticateUserUseCase";

class AuthenticateUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { password, email } = request.body;

        const authenticateUseCase = container.resolve(AuthtenticateUserUseCase);

        const token = await authenticateUseCase.execute({
            password,
            email,
        });

        return response.json(token);
    }
}

export { AuthenticateUserController };
