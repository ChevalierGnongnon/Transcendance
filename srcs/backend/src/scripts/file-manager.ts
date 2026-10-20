import { prisma } from '../lib/prisma.js';
import fs from 'fs'

export async function fileManager(){
    let files;
    try {
        files = await prisma.file.findMany({
            where:{
                type: 'message',
                expiresAt: { not: null, lte: new Date() }
            }
        })
    } catch (err) {
        console.error('error for fetching expired files:', err);
        return ;
    }
   for (const file of files){
        try {
            fs.unlinkSync(`/app/uploads/${file.name}`);
        } catch (err) {
            if (!(err instanceof Error && 'code' in err && err.code === 'ENOENT')) {
                console.error('error for deleting file ' + file.id + ':', err);
                continue ;
            }
        }
        try {
            await prisma.file.delete({ where: { id: file.id } })
        } catch (err) {
            console.error('error for deleting file ' + file.id + ' in database:', err);
        }
   }
}