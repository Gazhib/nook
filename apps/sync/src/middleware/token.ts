import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { SignJWT, errors, jwtVerify } from "jose";
import "../loadEnv";

const accessSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

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
  try {
    const accessToken = getCookie(c, "access_token");
    if (!accessToken) {
      throw new HTTPException(401, { message: "User has no access token" });
    }
    const { payload } = await jwtVerify(accessToken, accessSecret);
    c.set("userId", payload.userId as string);
  } catch (err) {
    if (err instanceof errors.JWTExpired) {
      // dont forget to handle expired jwt
      throw new HTTPException(401, {
        message: "User token is expired",
      });
    } else if (
      err instanceof errors.JWTInvalid ||
      err instanceof errors.JWSSignatureVerificationFailed
    ) {
      throw new HTTPException(401, {
        message: "User token is invalid or verification failed",
      });
    } else {
      throw new HTTPException(401, {
        message: `User token is invalid:${err}`,
      });
    }
  }
  await next();
});
