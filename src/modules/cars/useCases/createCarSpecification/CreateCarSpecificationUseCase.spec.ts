import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";
import { AppError } from "@shared/errors/AppError";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
let createCarSpecificationUseCase: CreateCarSpecificationUseCase;

describe("Create Car Specification", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it("should be able to add a new specification to a non-existant car", async () => {
    const car_id = "ahshd-23123-kiir8";
    const specifications_id = ["85932"];

    await expect(
      createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      })
    ).rejects.toEqual(new AppError("Car does not exists!"));
  });

  it("should be able to add a new specification to the car", async () => {
    const car = await carsRepositoryInMemory.create({
      brand: "marca",
      category_id: "categoria",
      daily_rate: 100,
      description: "Descrição",
      fine_amount: 60,
      license_plate: "ABC-1234",
      name: "Carrinho",
    });

    const specification = await specificationsRepositoryInMemory.create({
      description: "test",
      name: "test",
    });

    const specifications_id = [specification.id];

    const specificationCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(specificationCars).toHaveProperty("specifications");
    expect(specificationCars.specifications.length).toBe(1);
  });
});
