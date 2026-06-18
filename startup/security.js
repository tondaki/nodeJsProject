const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const cors = require("cors");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

module.exports = function (app) {
  app.use(helmet());

  app.use(cors());

  app.use(compression());

  app.use(hpp());

  app.use(mongoSanitize());

  app.use(xss());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true, //باعث می‌شود وضعیت محدودیت (مثل تعداد درخواست باقی‌مانده) با استانداردهای جدید و رسمی در هدر پاسخ نمایش داده ش
    legacyHeaders: false, // هدرهای قدیمی و غیررسمی (که با X- شروع می‌شدند) را حذف می‌کند تا پاسخ‌ها تمیزتر و استانداردتر باشند
    message: {
      msg: "Too many requests, try again later.",
    },
  });

  app.use(limiter);
};

// helmet	امن کردن Headerهای HTTP
// express-rate-limit	محدود کردن تعداد درخواست‌ها، جلوگیری از Brute Force و Spam
// hpp	جلوگیری از تکرار مخرب پارامترهای Query و Body
// compression	فشرده کردن Response برای کاهش حجم و افزایش سرعت (امنیتی نیست، مربوط به Performance است)
// express-mongo-sanitize	جلوگیری از NoSQL Injection
// xss-clean	جلوگیری از XSS
