import { Context } from "hono";
import prisma from "../../prisma/client";
import { loginSchema, userSchema } from "../validation/user";
// import  * as bcrypt from "bcryptjs";
import { sign } from "hono/jwt"

export const register = async (c: Context) => {
    try {
        const body = await c.req.parseBody()
        const valid = userSchema.safeParse(body)
        if (!valid.success) {
            return c.json({
                status: "error",
                data: valid.error.message
            }, 400)
        }
        // const hashPass = await bcrypt.hash(valid.data.password, 10)
        // valid.data.password = hashPass
        const cekUser = await prisma.user.findFirst({
            where: {
                email: valid.data.email
            }
        })
        if (cekUser) {
            return c.json({
                status: "error",
                data: "user already exist"
            }, 400)
        }
        const user = await prisma.user.create({
            data: {
                name: valid.data.name,
                email: valid.data.email,
                password: valid.data.password
            }
        })
        return c.json({
            status: "success",
            data: user
        }, 200)
    } catch (e: unknown) {
        console.error(`error register user ${e}`)
        return c.text(`error register user ${e}`, 500);

    }
}
export const login = async (c: Context) => {
    try {
        const body = await c.req.parseBody()
        const valid = loginSchema.safeParse(body)
        if (!valid.success) {
            return c.json({
                status: "error",
                data: valid.error.message
            }, 400)
        }
        const user = await prisma.user.findFirst({
            where: {
                email: valid.data.email
            }
        })
        if (!user) {
            return c.json({
                status: "error",
                data: "user not found"
            }, 400)
        }
        // const checkPass = await bcrypt.compare(valid.data.password, user.password)
        // if (!checkPass) {
        //     return c.json({
        //         status: "error",
        //         data: "wrong password"
        //     })
        // }
        const payload = {
            sub: user.id,
            exp: Math.floor(Date.now() / 1000) + 60 * 5

        }
        const secret = Bun.env.SecretJWT
        if (!secret) {
            throw new Error("secret not found")
        }
        const token = await sign(payload, secret)
        return c.json({
            status: "success",
            data: user,
            token
        }, 200)

    } catch (e: unknown) {
        console.error(`error login user ${e}`);
        return c.text(`error login user ${e}`, 500);

    }
}