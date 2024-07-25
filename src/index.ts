import { Hono } from 'hono'
import { routerArticle, routerUser } from './routes/index'


const app = new Hono().basePath('/api')

app.route('/', routerArticle)
app.route('/', routerUser)

export default app
