import { ErrorHandler, Injectable } from "@angular/core";
import { ErrorHandlerService } from "./services/error-handler.service";

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  constructor(private errorHandlerService: ErrorHandlerService) { }

  handleError(error: Error): void {
    const message = error.message;
    this.errorHandlerService.setError(message, error.stack);
    console.error(error);
  }
}
