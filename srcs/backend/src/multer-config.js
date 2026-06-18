const express = require('express');
const multer = require('multer');
const fs = require('fs');

function uploadConfig(options){
    return (multer({
        storage: diskStorage,
        limits: {fileSize: options.maxSize}, 
        fileFilter: options.fileFilter
    }));
}