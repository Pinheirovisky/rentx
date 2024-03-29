import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";
import { AppError } from "@shared/errors/AppError";

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
    const category = {
      description: "Cat description test 2",
      name: "Cat Test 2",
    };

    await createCategoryUseCase.execute({
      description: category.description,
      name: category.name,
    });

    await expect(
      createCategoryUseCase.execute({
        description: category.description,
        name: category.name,
      })
    ).rejects.toEqual(new AppError("Category already exists!"));
  });
});
