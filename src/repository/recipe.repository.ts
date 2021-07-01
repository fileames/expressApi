import * as express from "express";
import { DatabaseError, RecipeNotFoundError } from "../common/htttp-exception";
import KnexDB from "../db/knex";

class RecipeRepository {
  recipeDB: typeof KnexDB;
  constructor() {
    this.recipeDB = KnexDB;
    this.recipeDB.init();
  }

  async listRecipes(): Promise<object[]> {
    return new Promise((resolve, reject) => {
      this.recipeDB.db
        .select(
          "id",
          "name",
          "cooktimeminutes",
          "timeadded",
          this.recipeDB.db.raw(
            "ARRAY_AGG(ingredients.ingredient) as ingredients"
          )
        )
        .from("recipes")
        .innerJoin("ingredients", "recipes.id", "ingredients.recipeid")
        .groupBy("recipes.id")
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(new DatabaseError());
        });
    });
  }

  async addRecipe(recipe: object): Promise<object> {
    return new Promise((resolve, reject) => {
      this.recipeDB
        .db("recipes")
        .insert(
          {
            name: recipe["name"],
            cooktimeminutes: recipe["cookTimeMinutes"],
            timeadded: recipe["timeAdded"],
          },
          "id"
        )
        .then((result) => {
          recipe["ingredients"].forEach((element) => {
            this.recipeDB
              .db("ingredients")
              .insert({
                recipeid: result[0],
                ingredient: element,
              })
              .then((result) => {
                console.log(result);
              });
          });

          resolve(recipe);
        })
        .catch((err) => {
          reject(new DatabaseError());
        });
    });
  }

  async getRecipeById(recipe_id: number): Promise<object> {
    return new Promise((resolve, reject) => {
      this.recipeDB
        .db("recipes")
        .select(
          "id",
          "name",
          "cooktimeminutes",
          "timeadded",
          this.recipeDB.db.raw(
            "ARRAY_AGG(ingredients.ingredient) as ingredients"
          )
        )
        .from("recipes")
        .innerJoin("ingredients", "recipes.id", "ingredients.recipeid")
        .groupBy("recipes.id")
        .where("recipes.id", recipe_id)
        .then((recipe) => {
          if (recipe) {
            resolve(recipe);
          } else {
            reject(new RecipeNotFoundError());
          }

          resolve(recipe);
        })
        .catch((err) => {
          reject(new DatabaseError());
        });
    });
  }
}

export default RecipeRepository;
