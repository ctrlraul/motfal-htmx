import { Session } from '../middlewares/session-parser';

declare global {
	namespace Express {
		interface Request {
			session: Session;
		}
	}
}