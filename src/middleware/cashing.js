const crypto = require("crypto");
const redis = require("../../startup/redis");
function cacheKey(req) {
  const raw = req.originalUrl || req.url;

  return "cache:" + crypto.createHash("sha1").update(raw).digest("hex");
}
function cacheMiddleware({ ttlSeconds = 60, methods = ["GET"] } = {}) {
  return async (req, res, next) => {
    try {
      if (!methods.includes(req.method)) {
        return next();
      }

      const key = cacheKey(req);

      const cached = await redis.get(key);

      if (cached) {
        return res.json(JSON.parse(cached));
      }

      const originalJson = res.json.bind(res);

      res.json = async (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          await redis.set(key, JSON.stringify(body), { EX: ttlSeconds });
        }

        return originalJson(body);
      };

      next();
    } catch (err) {
      next();
    }
  };
}

module.exports = { cacheMiddleware };
