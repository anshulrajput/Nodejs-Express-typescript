import Joi from 'joi';

export const checkOrder = Joi.object().keys({
    apparels: Joi.array().disallow("null").min(1)
        .unique((a, b) => a.apparelCode === b.apparelCode && a.size === b.size)
        .items(Joi.object({
            apparelCode: Joi.string().required(),
            size: Joi.string().required(),
            qty: Joi.number()
        })
        .or("qty", "price")).required()
})