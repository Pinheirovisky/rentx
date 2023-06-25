import { AppError } from "../../../../errors/AppError";
import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/CategoriesRepositoryInMemory";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe("Create Category", () => {
    beforeEach(() => {
        categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
        createCategoryUseCase = new CreateCategoryUseCase(
            categoriesRepositoryInMemory
        );
    });

    it("should be able to create a new category", async () => {
        const category = {
            description: "Category description test",
            name: "Category Test",
        };

        await createCategoryUseCase.execute({
            description: category.description,
            name: category.name,
        });

        const categoryCreated = await categoriesRepositoryInMemory.findByName(
            category.name
        );

        expect(categoryCreated).toHaveProperty("id");
    });

    it("should not be able to create a new category with already exists", async () => {
        expect(async () => {
            const category = {
                description: "Category description test",
                name: "Category Test",
            };

            await createCategoryUseCase.execute({
                description: category.description,
                name: category.name,
            });

            await createCategoryUseCase.execute({
                description: category.description,
                name: category.name,
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
