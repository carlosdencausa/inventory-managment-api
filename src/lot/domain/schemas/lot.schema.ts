import * as Joi from 'joi';

export const lotStockUpdateSchema = Joi.object({
  product_id: Joi.number().integer().required(),
  warehouse_id: Joi.number().integer().required(),
  stock: Joi.number().integer().min(0).required(),
});

export const lotStockUpdateArraySchema = Joi.array()
  .items(lotStockUpdateSchema)
  .min(1)
  .required();
