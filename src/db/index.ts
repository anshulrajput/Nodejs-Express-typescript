import fs from 'fs';
import Apparel from '../interfaces/Apparel'
import path from 'path'
import logger from '../utils/logging.utils'

const readJsonData = async(): Promise<Apparel[]> => {
    try {
        const jsonString = await fs.readFileSync(path.join(__dirname,"data.json"), "utf-8");
        const data = JSON.parse(jsonString);

        return data
    }
    catch (err) {
        console.log(err);
        logger.error('Error in reading Json Data');
        throw(err);
    }
}

const writeJsonData = async(jsonData: Apparel[]): Promise<void> => {
    try {
        await fs.writeFileSync(path.join(__dirname,"data.json"), JSON.stringify(jsonData));
    }
    catch (err) {
        console.log(err);
        logger.error('Error in writing Json Data');
        throw(err);
    }
}

export {
    readJsonData,
    writeJsonData
}