import { prisma } from '../lib/prisma.js';
import fs from 'fs'

export async function fileManager(){
    const files = await prisma.file.findMany({
        where:{
            type: 'message', 
            expiresAt: { not: null, lte: new Date() }
        }
   })
   for (const file of files){
        try {
            await prisma.file.delete({ where: { id: file.id } })
            fs.unlinkSync(`/app/uploads/${file.name}`);
        } catch (err) {
            if (err instanceof Error && 'code' in err && err.code !== 'ENOENT') {
                throw err;
            }
        }
   }
}