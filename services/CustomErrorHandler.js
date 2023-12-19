class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }
  static alreadyExist(message) {
    return new CustomErrorHandler(409, message);
  }

  static wrongCredentials(message) {
    return new CustomErrorHandler(401, message);
  }

  static unauthorized(message) {
    return new CustomErrorHandler(401, message);
  }

  static notFound(message) {
    return new CustomErrorHandler(401, message);
  }
}
export default CustomErrorHandler;
