import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
// import initAdmin from './database/scripts/init_admin';
// import initDefaultPictures from './database/scripts/init_default_profile_pictures';
import routes from "./routes";
import usersRouter from './routes/user/users.js';

const app = express();


app.use(helmet());
app.use(cors({ origin: 'https://transcendance.fr' }));
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);
app.use(usersRouter);

export default app;




