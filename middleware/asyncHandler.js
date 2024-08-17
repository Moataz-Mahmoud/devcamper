const asyncHandler = handle => (req, res, next) =>
  Promise.resolve(handle(req, res, next)).catch(next);

export default asyncHandler;
