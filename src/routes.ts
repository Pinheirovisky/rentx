import { Request, Response } from "express";
import CreateCourseService from "./CreateCourseService";

export function createCourse(request: Request, response: Response) {
  CreateCourseService.execute({
    name: "NodeJs",
    duration: 10,
    educator: "Vini",
  });

  return response.json({
    name: "NodeJs",
    duration: 10,
    educator: "Vini",
  });
}
