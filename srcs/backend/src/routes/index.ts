import { Router } from "express";

import healthRouter from "./health";
import registrationRouter from "./auth/registration";
import loginRouter from './auth/login';
import checkAuth from './auth/check-auth';
import logoutRouter from './auth/logout';
import myProfileRouter from './user/my-profile';
import completeProfileRouter from './user/complete-profile';
import uploadRouter from './files/upload-file';
import defaultAvatarRoute from './files/default-avatars'

const routers = Router();

routers.use("/health", healthRouter);
routers.use("/register", registrationRouter);
routers.use("/complete-profile", completeProfileRouter);
routers.use("/my-profile", myProfileRouter);
routers.use("/login", loginRouter);
routers.use("/check-auth", checkAuth);
routers.use("/logout", logoutRouter);
routers.use("/upload", uploadRouter);
routers.use("/default-avatars", defaultAvatarRoute);
// routers.use("/",);


export default routers;
