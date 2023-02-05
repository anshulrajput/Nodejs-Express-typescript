import Joi from 'joi';

export const updateStockAndPrice = Joi.object().keys({
    vendorId: Joi.string().required(),
    apparelCode: Joi.string().required(),
    size: Joi.string().required(),
    qty: Joi.number(),
    price: Joi.number()
}).or("qty", "price");

export const updateMultipleStockAndPrice = Joi.object().keys({
    vendorId: Joi.string().required(),
    apparels: Joi.array().disallow("null").min(1)
        .unique((a, b) => a.apparelCode === b.apparelCode && a.size === b.size)
        .items(Joi.object({
            apparelCode: Joi.string().required(),
            size: Joi.string().required(),
            qty: Joi.number(),
            price: Joi.number()
        })
            .or("qty", "price")).required()
})