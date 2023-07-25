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
    const rental = await createRentalUseCase.execute({
      car_id: "123213",
      expected_return_date: dayAdd24Hours,
      user_id: "321321",
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if it has already been created to the same user", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "123213",
        expected_return_date: dayAdd24Hours,
        user_id: "321321",
      });

      const rental = await createRentalUseCase.execute({
        car_id: "123213",
        expected_return_date: dayAdd24Hours,
        user_id: "321321",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental if it has already been created to the same car", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "test",
        expected_return_date: dayAdd24Hours,
        user_id: "121212",
      });

      const rental = await createRentalUseCase.execute({
        car_id: "test",
        expected_return_date: dayAdd24Hours,
        user_id: "321321",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental with invalid return time", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: "test",
        expected_return_date: dayjs().toDate(),
        user_id: "121212",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
