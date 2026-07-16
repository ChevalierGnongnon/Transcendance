const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const database = require('../../config/db-connexion');
const uploadConfig = require('../../config/multer-config');
const fs = require('fs');
const path = require('path');
const router = express.Router();

import { Request, Response } from 'express';


router.post('/upload', async(req: Request, res: Response) =>{
    
})