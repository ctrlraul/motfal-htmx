import { env } from './helpers/env';
import { WebServer } from './web-server';

const port = env('PORT', '3001');

WebServer.listen(port);
