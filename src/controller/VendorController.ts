import { NextFunction, Request, Response } from "express"
import createResponse from '../utils/response.utils';
import { readJsonData, writeJsonData } from '../db/index';
import Apparel,{ApparelDict, SizeDict} from '../interfaces/Apparel';
import logger from '../utils/logging.utils'

/*
    will return null if apparel not found,
    will return apparel object if found
*/
function searchApparel(
    apparelDict: ApparelDict,
    vendorId: string,
    apparelCode: string,
    size: string
): any | null{

    // check if apparel object exists in db
    if(!apparelDict[`${vendorId}_${apparelCode}`]){
        logger.error(`Vendor Id - ${vendorId} , Apparel Code - ${apparelCode} Not Found`)
        return null
    }
    let apparelObj = apparelDict[`${vendorId}_${apparelCode}`]

    // check if size object exists in apparel
    if(!apparelObj['sizes'][`${size}`]){
        logger.error(`Vendor Id - ${vendorId} , Apparel Code - ${apparelCode}, Size - ${size} Not Found`)
        return null
    }
    let sizeObj = apparelObj['sizes'][`${size}`]

    // logger.info(apparelObj)
    // logger.info(sizeObj)

    return {
        ...apparelObj,
        size: sizeObj
    }
}

function createDictionaryFromArray(jsonData: Apparel[]){
    let dict: ApparelDict = {}
    for (let i = 0; i < jsonData.length; i++) {
        const apparelObj = jsonData[i];

        let sizeDict: SizeDict = {}
        // size dict : key - size
        apparelObj['sizes'].forEach((sizeObj,index) => {
            sizeDict[`${sizeObj['size']}`] = { ...sizeObj, index: index }
        });

        // main apparel dict : key - vendorId_apparelCode
        dict[`${apparelObj['vendorId']}_${apparelObj['apparelCode']}`] = {
            ...apparelObj,
            sizes: sizeDict,
            index: i
        }
    }
    // logger.info(dict)
    return dict
}

const updateStockAndPrice = async(req: Request,res: Response,next: NextFunction): Promise<Response | undefined> => {
    let { vendorId, apparelCode, size, qty, price } = req.body
    try {
        let data: Apparel[] = await readJsonData()
        let apparelDict = createDictionaryFromArray(data)

        // search apparel in db
        let apparel = searchApparel(apparelDict, vendorId, apparelCode, size)
        if(!apparel)
            return res.status(404).json(createResponse(false,"Apparel Not Found"));

        // logger.info(apparel)

        // update apparel object
        if(qty != undefined)
            data[apparel.index]['sizes'][apparel.size.index]['qty'] = qty

        if(price != undefined)
            data[apparel.index]['sizes'][apparel.size.index]['price'] = price

        // write updated data to db
        await writeJsonData(data)

        return res.status(200).json(createResponse(true,"Data Updated",data[apparel.index]));
    } catch (error) {
        next(error)
    }
}

const updateMultipleStockAndPrice = async(req: Request,res: Response,next: NextFunction): Promise<Response | undefined> => {
    let { vendorId, apparels } = req.body
    try {
        let data: Apparel[] = await readJsonData()
        let apparelDict = createDictionaryFromArray(data)

        // search apparels in db
        let notFoundApparels: { apparelCode: string; size: string; qty: number | undefined; price: number | undefined; }[] = []
        let updatedApparels: Apparel[] = []
        apparels.forEach((apparelToUpdate: { apparelCode: string; size: string; qty: number | undefined; price: number | undefined; }) => {
            let apparel = searchApparel(apparelDict, vendorId, apparelToUpdate.apparelCode, apparelToUpdate.size)
            if(!apparel)
                return notFoundApparels.push(apparelToUpdate)
    
            // logger.info(apparel)

            // update apparel object
            if(apparelToUpdate.qty != undefined)
                data[apparel.index]['sizes'][apparel.size.index]['qty'] = apparelToUpdate.qty

            if(apparelToUpdate.price != undefined)
                data[apparel.index]['sizes'][apparel.size.index]['price'] = apparelToUpdate.price

            updatedApparels.push(data[apparel.index])
        });

        if(notFoundApparels.length > 0){
            return res.status(404).json(createResponse(false,"Apparels Not Found",{"ApparelsNotFound":notFoundApparels}));
        }
    
        // write updated data to db
        await writeJsonData(data)

        return res.status(200).json(createResponse(true,"Data Updated"));
    } catch (error) {
        next(error)
    }
}

export {
    updateStockAndPrice,
    updateMultipleStockAndPrice
}