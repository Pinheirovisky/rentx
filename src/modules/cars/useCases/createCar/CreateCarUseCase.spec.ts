import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "./CreateCarUseCase";
import { AppError } from "@shared/errors/AppError";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      brand: "marca",
      category_id: "categoria",
      daily_rate: 100,
      description: "Descrição",
      fine_amount: 60,
      license_plate: "ABC-1234",
      name: "Carrinho",
    });

    expect(car).toHaveProperty("id");
  });

  it("should not be able to create a car if the license plate have already exists!", async () => {
    expect(async () => {
      await createCarUseCase.execute({
        brand: "marca",
        category_id: "categoria",
        daily_rate: 100,
        description: "Descrição",
        fine_amount: 60,
        license_plate: "ABC-1234",
        name: "Carrinho 1",
      });

      await createCarUseCase.execute({
        brand: "marca",
        category_id: "categoria",
        daily_rate: 100,
        description: "Descrição",
        fine_amount: 60,
        license_plate: "ABC-1234",
        name: "Carrinho 2",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to create a car with avaliable true by default", async () => {
    const car = await createCarUseCase.execute({
      brand: "marca",
      category_id: "categoria",
      daily_rate: 100,
      description: "Descrição",
      fine_amount: 60,
      license_plate: "DEF-1234",
      name: "Car avaliable",
    });

    expect(car.avaliable).toBeTruthy();
  });
});
