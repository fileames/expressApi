import Joi from "joi";

const schemas = {
  validateRecipe: Joi.object().keys({
    name: Joi.string().min(3).max(100).required(),
    cook_time_minutes: Joi.number().integer().optional(),
    ingredients: Joi.array().items(Joi.string().min(3).max(50).lowercase()).optional(),
  }),
  validateRecipeId: Joi.number().integer().min(1),
  validateUpdateRecipe: Joi.object().keys({
    name: Joi.string().min(3).max(100).optional(),
    cook_time_minutes: Joi.number().integer().optional(),
    ingredients: Joi.array().items(Joi.string().min(3).max(50).lowercase()).optional(),
  }),
};

export default schemas;
