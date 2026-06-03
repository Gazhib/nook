import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { SignJWT, errors, jwtVerify } from "jose";
import { JWT_ACCESS_SECRET } from "../loadEnv";

const accessSecret = new TextEncoder().encode(JWT_ACCESS_SECRET);

/** Map a jose verification failure onto a 401 with a safe, specific message. */
function toAuthError(err: unknown): HTTPException {
  if (err instanceof errors.JWTExpired) {
    return new HTTPException(401, { message: "User token is expired" });
  }
  if (
    err instanceof errors.JWTInvalid ||
    err instanceof errors.JWSSignatureVerificationFailed
  ) {
    return new HTTPException(401, {
      message: "User token is invalid or verification failed",
    });
  }
  return new HTTPException(401, { message: "User token is invalid" });
}

export const generateAndSetAccessToken = async ({
  userId,
}: {
  userId: string;
}) => {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(accessSecret);

  return token;
};

export const tokenMiddleware = createMiddleware(async (c, next) => {
  const accessToken = getCookie(c, "access_token");
  if (!accessToken) {
    throw new HTTPException(401, { message: "User has no access token" });
  }

  let userId: string | undefined;
  try {
    const { payload } = await jwtVerify(accessToken, accessSecret);
    userId = typeof payload.userId === "string" ? payload.userId : undefined;
  } catch (err) {
    throw toAuthError(err);
  }

  if (!userId) {
    throw new HTTPException(401, { message: "User token is invalid" });
  }

  c.set("userId", userId);
  await next();
});

export const verifyToken = async (token: string | undefined): Promise<string> => {
  if (!token) {
    throw new HTTPException(401, { message: "User has no access token" });
  }

  let payload;
  try {
    ({ payload } = await jwtVerify(token, accessSecret));
  } catch (err) {
    throw toAuthError(err);
  }

  if (typeof payload.userId !== "string") {
    throw new HTTPException(401, { message: "User token is invalid" });
  }

  return payload.userId;
};
