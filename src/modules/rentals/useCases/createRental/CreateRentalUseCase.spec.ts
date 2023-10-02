import dayjs from "dayjs";

import { AppError } from "@shared/errors/AppError";
import { CreateRentalUseCase } from "./CreateRentalUseCase";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/Implementations/DayjsDateProvider";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsProvider: DayjsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();
  beforeEach(() => {
    dayjsProvider = new DayjsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsProvider,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Test",
      description: "Car Test",
      daily_rate: 100,
      license_plate: "test",
      fine_amount: 40,
      category_id: "1234",
      brand: "brand",
    });

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
      user_id: "321321",
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if it has already been created to the same user", async () => {
    await rentalsRepositoryInMemory.create({
      car_id: "121212",
      expected_return_date: dayAdd24Hours,
      user_id: "321321",
    });

    await expect(
      createRentalUseCase.execute({
        car_id: "123213",
        expected_return_date: dayAdd24Hours,
        user_id: "321321",
      })
    ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
  });

  it("should not be able to create a new rental if it has already been created to the same car", async () => {
    await rentalsRepositoryInMemory.create({
      car_id: "test",
      expected_return_date: dayAdd24Hours,
      user_id: "321321",
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "123",
        car_id: "test",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("Car is unavailable"));
  });

  it("should not be able to create a new rental with invalid return time", async () => {
    await expect(
      createRentalUseCase.execute({
        car_id: "test",
        expected_return_date: dayjs().toDate(),
        user_id: "121212",
      })
    ).rejects.toEqual(new AppError("Invalid return time!"));
  });
});
