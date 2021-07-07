import * as express from "express";
import BaseController from "./base.controller";
import schemas from "../validation/recipe.validation";
import RecipeService from "../service/recipe.service";
import Joi from "joi";
import { ValidationError } from "../common/htttp-exception";

class RecipeController extends BaseController {
  recipeService: RecipeService;

  constructor() {
    super();
    this.initializeRoutes();
    this.recipeService = new RecipeService();
  }

  listRecipes(req: express.Request, res: express.Response, next: express.NextFunction) {
    this.recipeService
      .listRecipes()
      .then((list) => {
        return res.status(200).send(list);
      })
      .catch((err) => {
        next(err);
      });
  }

  addRecipe(req: express.Request, res: express.Response, next: express.NextFunction) {

    const { body } = req;

    schemas.validateRecipe
      .validateAsync(body)
      .then((validatedRecipe) => {

        this.recipeService
          .addRecipe(validatedRecipe)
          .then((recipe) => {
            return res.status(201).send(recipe);
          })
          .catch((err) => {
            next(err);
          });

      })
      .catch((err: Joi.ValidationError) => {
        next(new ValidationError(err.message));
      });
  }

  getRecipe(req: express.Request, res: express.Response, next: express.NextFunction) {

    const recipe_id = req.params.recipe_id;

    schemas.validateRecipeId
      .validateAsync(recipe_id)
      .then((validatedId) => {
        this.recipeService
          .getRecipeById(validatedId)
          .then((recipe) => {
            return res.status(200).send(recipe);
          })
          .catch((err) => {
            console.log("ERR")
            console.log(err)
            next(err);
          });
      })
      .catch((err: Joi.ValidationError) => {
        next(new ValidationError(err.message));
      });
  }

  deleteRecipe(req: express.Request, res: express.Response, next: express.NextFunction) {

    const recipe_id = req.params.recipe_id;

    schemas.validateRecipeId
      .validateAsync(recipe_id)
      .then((validatedId) => {
        this.recipeService
          .deleteRecipeById(validatedId)
          .then((_) => {
            return res.status(204).send();
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err: Joi.ValidationError) => {
        next(new ValidationError(err.message));
      });
  }

  updateRecipe(req: express.Request, res: express.Response, next: express.NextFunction) {

    const recipe_id = req.params.recipe_id;
    const { body } = req;

    const validateObj = req.body;
    validateObj.id = recipe_id;

    schemas.validateUpdateRecipe
      .validateAsync(validateObj)
      .then((validatedRecipe) => {
            this.recipeService
              .updateRecipe(validatedRecipe)
              .then((recipe) => {
                return res.status(200).send(recipe);
              })
              .catch((err) => {
                next(err);
              });
      })
      .catch((err: Joi.ValidationError) => {
        next(new ValidationError(err.message));
      });
  }

  initializeRoutes() {
    console.log("route init");
    this.router.get("/", this.listRecipes.bind(this));
    this.router.post("/", this.addRecipe.bind(this));
    this.router.get("/:recipe_id", this.getRecipe.bind(this));
    this.router.delete("/:recipe_id", this.deleteRecipe.bind(this));
    this.router.patch("/:recipe_id", this.updateRecipe.bind(this))
  }
}

const recipeController = new RecipeController();
export default recipeController.router;