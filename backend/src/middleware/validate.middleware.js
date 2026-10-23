const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: "Request validation failed",
        errors: result.error.details.map((item) => item.message),
      });
    }

    req.body = result.value;
    next();
  };
};

module.exports = validate;
