import { verify, decode } from "hono/jwt"
import { Context, Next } from 'hono'

export const isauth = async (c: Context, next: Next) => {
    try {
        const token = c.req.header("Authorization");
        if (!token) {
            return c.text("Unauthorized: kepala salah", 401);
        }

        // Memisahkan 'Bearer' dan token
        const parts = token.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return c.text("Unauthorized: Malformed token", 401);
        }

        const jwt = parts[1];

        // Ambil secret dari environment variable
        const secret = Bun.env.SecretJWT;
        if (!secret) {
            return c.text("Unauthorized: Secret not found", 401);
        }

        // Verifikasi token
        const tokenData = await verify(jwt, secret);
        if (!tokenData) {
            return c.text("Unauthorized: Invalid token", 401);
        }
        // Simpan data pengguna dalam konteks
        c.set("user", tokenData);
    } catch (e) {
        console.error(`Error during authorization: ${e}`);
        return c.text("Unauthorized: Token verification failed", 401);
    }

    // Lanjutkan ke handler berikutnya
    await next();
};