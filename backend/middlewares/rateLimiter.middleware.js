const buckets = new Map();

const CAPACITY = 10;
const REFILL_RATE = 1 / 6000; //  1 token per 6 seconds

export const rateLimiter = (req, res, next) => {
  const key = req.ip;
  const now = Date.now();

  let bucket = buckets.get(key);


  // create new bucket
  if (!bucket) {
    bucket = {
      tokens: CAPACITY,
      lastRefill: now,
    };
  }

  // refill tokens
  const elapsedTime = now - bucket.lastRefill;
  const newTokens = elapsedTime * REFILL_RATE;

  bucket.tokens = Math.min(CAPACITY, bucket.tokens + newTokens);

  bucket.lastRefill = now;

  if (bucket.tokens < 1) {
    const timeUntilNextToken = Math.ceil(
      (1 - bucket.tokens) / REFILL_RATE / 1000,
    );

    buckets.set(key, bucket);

    res.set("Retry-After", String(timeUntilNextToken));

    return res.status(429).json({
      success: false,
      message: "Too many requests.",
      retryAfter: timeUntilNextToken,
    });
  }

  // ein Token verbrauchen
  bucket.tokens -= 1;
  buckets.set(key, bucket);

  next();
};
