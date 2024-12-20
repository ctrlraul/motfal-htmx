import { Application } from '@oak/oak';
import { env } from '@raul/env';
import { serveStatic } from './middlewares/serve-static.ts';
import { errorHandler } from './middlewares/error-handler.ts';
import { router as gameRouter } from './routers/game-router.tsx';
import { logFnMiddleware } from './middlewares/log-fn.ts';
import { EventSender } from './managers/event-sender.ts';


const port = parseInt(env('PORT', '3001'));
const app = new Application();


app.use(logFnMiddleware);
app.use(errorHandler);

app.use(gameRouter.routes());
app.use(gameRouter.allowedMethods());

app.use(EventSender.router.routes());
app.use(EventSender.router.allowedMethods());

app.use(serveStatic('static'));

app.addEventListener('listen', event => console.log('Listening on port', event.port));

app.listen({ port });
