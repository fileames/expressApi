import * as express from "express";
import RecipeRepository from "../repository/recipe.repository";

class RecipeService {
  recipes: object[];
  recipeRepository: RecipeRepository;

  constructor() {
    console.log("service constuctor");
    this.recipeRepository = new RecipeRepository();
    this.recipes = [];
  }

  async listRecipes(): Promise<Object[]> {
    return new Promise((resolve, reject) => {
      try {
        this.recipeRepository.listRecipes().then((res) => {
          return resolve(res);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async getRecipeById(recipe_id: number): Promise<Object> {
    return new Promise((resolve, reject) => {
      try {
        this.recipeRepository.getRecipeById(recipe_id).then((res) => {
          return resolve(res);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async addRecipe(recipe: object): Promise<object> {
    return new Promise((resolve, reject) => {
      try {
        recipe["timeAdded"] = new Date(Date.now()).toISOString();
        this.recipeRepository.addRecipe(recipe).then((res) => {
          return resolve(res);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default RecipeService;
