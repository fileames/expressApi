import * as express from "express";
import RecipeRepository from "../repository/recipe.repository";
import RecipeDb from "../dto/recipe";
import AddRecipe from "../dto/add_recipe";
import AddRecipeWithTime from "../dto/add_recipe_with_time";
import UpdateRecipe from "../dto/update_recipe";

class RecipeService {
  recipes: object[];
  recipeRepository: RecipeRepository;

  constructor() {
    console.log("service constuctor");
    this.recipeRepository = new RecipeRepository();
    this.recipes = [];
  }

  async listRecipes(): Promise<RecipeDb[]> {
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

  async getRecipeById(recipe_id: number): Promise<RecipeDb> {
    return new Promise((resolve, reject) => {
      try {
        this.recipeRepository.getRecipeById(recipe_id)
        .then((res) => {
          return resolve(res);
        }).catch((err)=>{
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async updateRecipe(recipe_id: number, recipe: UpdateRecipe): Promise<RecipeDb> {
    return new Promise((resolve, reject) => {
      try {
        this.recipeRepository.updateRecipe(recipe_id, recipe)
        .then((res) => {
          return resolve(res);
        }).catch((err)=>{
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async deleteRecipeById(recipe_id: number): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.recipeRepository.deleteRecipeById(recipe_id).then((res) => {
          return resolve(res);
        }).catch((err)=>{
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async addRecipe(recipe: AddRecipe): Promise<RecipeDb> {
    return new Promise((resolve, reject) => {
      try {
        const recipeReq = {...recipe}
        recipeReq["time_added"] = new Date(Date.now()).toISOString();

        this.recipeRepository.addRecipe(recipeReq as AddRecipeWithTime).then((res) => {
          return resolve(res);
        });

      } catch (err) {
        reject(err);
      }
    });
  }
}

export default RecipeService;
