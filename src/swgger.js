const swggerJsdoc = require("swagger-jsdoc");
const swggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Api",
      version: "1.0.0",
      description: "Task Manger API",
    },
    tags: [
      {
        name: "Users",
        description: "عملیات مربوط به کاربران",
      },
    ],
    servers: [
      {
        url: "http://localhost:8000/api",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "شناسه منحصر به فرد کاربر",
              example: 1,
            },
            name: {
              type: "string",
              description: "نام کاربر",
              example: "Ali",
            },
            email: {
              type: "string",
              format: "email",
              description: "آدرس ایمیل کاربر",
              example: "ali@example.com",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            code: {
              type: "string",
              example: "Not_FOUND",
            },
            message: {
              type: "string",
              example: "هیچ کاربری یافت نشد.",
            },
          },
        },
      },
      required: ["id", "name", "email"],
    },
  },
  apis: ["./src/routes/**/*.js"],
};

const specs = swggerJsdoc(options);

module.exports = {
  specs,
  swggerUi,
};
