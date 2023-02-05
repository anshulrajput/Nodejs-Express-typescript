import { NextFunction, Request, Response } from "express"
import createResponse from '../utils/response.utils';
import { readJsonData } from '../db/index';
import Apparel,{SortedApparelDict, SizeDict} from '../interfaces/Apparel';
import logger from '../utils/logging.utils'

function insertAtPosition(array: {}[],data: {},position: number){
    array.splice(position, 0, data);
}

/*
    will return null if apparel cannot be fulfilled,
    will return total cost for the apparel if qty requested is available
*/
function checkAvailabilityAndGetCost(sortedApparelDict: SortedApparelDict,apparel: { apparelCode: string; size: string; qty: number; }): number | null{
    let key = `${apparel['apparelCode']}_${apparel['size']}`

    if(!sortedApparelDict[key]){
        logger.error(`Apparel ${apparel['apparelCode']}, Size ${apparel['size']}, Not Available`)
        return null
    }

    // check requested qty available for this apparel
    let priceQtyArray = sortedApparelDict[key]
    let pendingQty = apparel['qty']
    let totalApparelCost = 0;
    for (let i = 0; i < priceQtyArray.length; i++) {
        const priceQtyObj = priceQtyArray[i];

        if(pendingQty < priceQtyObj['qty']){
            totalApparelCost += (pendingQty * priceQtyObj['price'])
            logger.info(`Apparel ${apparel['apparelCode']}, Size ${apparel['size']} Alloted ${pendingQty} Qty for ${priceQtyObj['price']}`)
            pendingQty = 0;
            break;
        }
        else{
            totalApparelCost += (priceQtyObj['qty'] * priceQtyObj['price'])
            logger.info(`Apparel ${apparel['apparelCode']}, Size ${apparel['size']} Alloted ${priceQtyObj['qty']} Qty for ${priceQtyObj['price']}`)
            pendingQty = pendingQty - priceQtyObj['qty']
        }
    }

    if(pendingQty > 0){
        logger.error(`Apparel ${apparel['apparelCode']}, Size ${apparel['size']}, Not Enough Quantity Available`)
        return null
    }
    else
        return totalApparelCost
}

function createDictionaryFromArray(jsonData: Apparel[]){
    let dict: SortedApparelDict = {}
    for (let i = 0; i < jsonData.length; i++) {
        const apparelObj = jsonData[i];

        // size dict : key - size
        for (let j = 0; j < apparelObj['sizes'].length; j++) {
            const sizeObj = apparelObj['sizes'][j];
            
            // main dict : key - apparelCode_size
            let key = `${apparelObj['apparelCode']}_${sizeObj['size']}`
            let newEntry = {
                vendorId: apparelObj['vendorId'],
                qty: sizeObj['qty'],
                price: sizeObj['price']
            }
            if(!dict[key]){
                dict[key] = [newEntry]
                continue;
            }

            // insert price and qty in ascending order inside the array
            let k = 0
            for (; k < dict[key].length; k++) {
                const priceQtyObj = dict[key][k];

                // check current price is less than current price in the object,
                // if not less then continue,
                // if less then break, this is the index where current price object needs to be inserted
                if(!(sizeObj['price'] < priceQtyObj['price']))
                    continue;

                // price is less, break
                break;
            }

            // console.log('inserting at pos - '+k)
            insertAtPosition(dict[key],newEntry,k)
        };

        
    }
    console.log(dict)
    return dict
}

const checkOrder = async(req: Request,res: Response,next: NextFunction): Promise<Response | undefined> => {
    let apparels: { apparelCode: string; size: string; qty: number; }[] = req.body.apparels
    try {
        let orderCanbeFulfilled = true;
        let totalOrderCost = 0;
        let data: Apparel[] = await readJsonData()
        let sortedApparelDict = createDictionaryFromArray(data)

        for (let i = 0; i < apparels.length; i++) {
            const apparel = apparels[i];
            
            let cost = checkAvailabilityAndGetCost(sortedApparelDict,apparel)
            console.log(`Cost for Apparel ${apparel['apparelCode']}, Size ${apparel['size']}, Quantity ${apparel['qty']} = ${cost}`)

            if(cost === null){
                orderCanbeFulfilled = false;
                // break;
            }
            else{
                totalOrderCost += cost;
            }
        }

        if(!orderCanbeFulfilled)
            return res.status(200).json(createResponse(false,"Order Cannot be Fulfilled"));

        return res.status(200).json(createResponse(true,"Order Can be Fulfilled",{ 'totalCost': totalOrderCost }));

    } catch (error) {
        next(error)
    }
}

export {
    checkOrder
}