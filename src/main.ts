import { Request, Response, NextFunction } from 'express';
import { router as gameRouter } from './routers/game-router';
import { EventSender } from './managers/event-sender';
import { env } from './helpers/env';
import express from 'express';
import cookieParser from 'cookie-parser';
import 'express-async-errors';


const port = parseInt(env('PORT', '3001'));
const app = express();

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
	console.error(`[${req.path}] Error:`, error);
	res.status(500)
	res.send('Something went wrong!');
	next();
});

app.use(cookieParser())
app.use(gameRouter);
app.use(EventSender.router);
app.use(express.static('static'));

app.listen(port, () => console.log('Listening on port', port));