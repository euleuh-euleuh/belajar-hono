import { Context } from "hono";
import prisma from "../../prisma/client";
import { articleSchema } from "../validation/article";

export async function create(c: Context) {
    try {
        const body = await c.req.parseBody()

        const valid = articleSchema.safeParse(body)
        if (!valid.success) {
            return c.json({
                status: "error",
                data: valid.error.message
            }, 400)
        }

        const cekTit = await prisma.article.findFirst({
            where: {
                title: valid.data.title
            }
        })
        if (cekTit) {
            return c.json({
                status: "title sudah digunakan",
                data: cekTit
            }, 400)
        }

        const post = await prisma.article.create({
            data: {
                title: valid.data.title,
                content: valid.data.content,
                userId: valid.data.userId
            }
        });
        return c.json({
            status: "success",
            data: post
        }, 200)

    } catch (e: unknown) {
        console.error(`error create article ${e}`)
        return c.text(`error create article ${e}`, 500)
    }
}

export async function getbyId(c: Context) {
    try {
        const id = parseInt(c.req.param('id'))

        const getone = await prisma.article.findUnique({
            where: {
                id: Number(id)
            }
        });
        return c.json({
            status: "success",
            data: getone
        }, 200)
    } catch (e: unknown) {
        console.error(`error getbyId article ${e}`)
        return c.text(`error getbyId article ${e}`, 500)
    }
}

export async function getAll(c: Context) {
    try {
        const getall = await prisma.article.findMany({ orderBy: { id: 'asc' } });
        return c.json({
            status: "success",
            data: getall
        }, 200)
    } catch (e: unknown) {
        console.error(`error getAll article ${e}`)
        return c.text(`error getAll article ${e}`, 500)
    }
}

export async function updArticle(c: Context) {
    try {
        const id = parseInt(c.req.param('id'))

        const body = await c.req.parseBody()

        const valid = articleSchema.safeParse(body)
        if (!valid.success) {
            return c.json({
                status: "error",
                data: valid.error
            }, 400)
        }

        const upd = await prisma.article.update({
            where: {
                id: Number(id)
            },
            data: {
                title: valid.data.title,
                content: valid.data.content,
                updatedAt: new Date()
            }
        })

        return c.json({
            status: "success",
            data: upd
        }, 200)

    } catch (e: unknown) {
        console.error(`error update article ${e}`)
        return c.text(`error update article ${e}`, 500)
    }
}

export async function delArticle(c: Context) {
    try {
        const id = parseInt(c.req.param('id'))
        const del = await prisma.article.delete({
            where: {
                id: Number(id)
            }
        })
        return c.json({
            status: "success",
            data: del
        }, 200)
    } catch (e: unknown) {
        console.error(`error delete article ${e}`)
        return c.text(`error delete article ${e}`, 500)
    }
}