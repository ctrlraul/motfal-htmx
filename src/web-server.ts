import { ErrorRequestHandler } from 'express';
import { router as gameRouter } from './routers/game-router';
import { EventSender } from './managers/event-sender';
import { Logger } from './helpers/logger';
import express from 'express';
import cookieParser from 'cookie-parser';
import chalk from 'chalk';
import 'express-async-errors';


const logger: Logger = new Logger('WebServer');
const app = express();


app.set('trust proxy', true);

// Logger middleware
app.use((req, _res, next) =>
{
	logger.info(req.method, req.path.replace(/\//g, chalk.blue('/')));
	next();
});

app.use(cookieParser())
app.use(gameRouter);
app.use(EventSender.router);
app.use(express.static('static'));

// 404 handler should come after all Routes
app.use((req, res) => {
	res.status(404).send(`Can't ${req.method} this route`);
});

// Error handler should come after all other app.use calls
app.use(((err, req, res, next) => {
	logger.error(req.method, req.path.replace(/\//g, chalk.blue('/')), 'Error:', err);

	if (res.statusCode == 200)
		res.statusCode = 500;

	res.send('Something went wrong!');
}) as ErrorRequestHandler);



function listen(port: string): void {
	app.listen(port, () => logger.info('Listening on port', port));
}


export const WebServer = {
	listen,
};
