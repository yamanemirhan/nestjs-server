export type Result<T> =
  | {
      success: true;
      statusCode: number;
      data?: T;
      message: string;
    }
  | {
      success: false;
      statusCode: number;
      errors: AppError[];
    };

export type AppError = {
  message: string;
  code?: string;
  field?: string;
};
