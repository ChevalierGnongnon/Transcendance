const crypto = require('crypto');
const database = require('../../srcs/backend/src/config/db-connexion.js')

const initDefaultProdilePictures= async() => {
    const hershel_img_id = crypto.randomUUID();
    const holocene_img_id = crypto.randomUUID();
    const kindred_img_id = crypto.randomUUID();
    const radian_img_id = crypto.randomUUID();
    const taxman_img_id = crypto.randomUUID();
    const virtue_img_id = crypto.randomUUID();

}

module.exports = initDefaultProdilePictures;


