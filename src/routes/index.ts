import { Hono } from "hono";

import { create, getAll, getbyId, updArticle, delArticle } from "../controller/articles";
import { register, login } from "../controller/users";
import { isauth } from "../middleware";

const router = new Hono().basePath("/article");

router.get("/getAll", (c) => getAll(c));
router.get("/get/:id", (c) => getbyId(c));
router.post("/create", isauth, (c) => create(c));
router.put("/upd/:id", isauth, (c) => updArticle(c));
router.delete("/del/:id", isauth, (c) => delArticle(c));

const router2 = new Hono().basePath("/users");

router2.post("/register", (c) => register(c));
router2.post("/login", (c) => login(c));

export const routerArticle = router;
export const routerUser = router2;