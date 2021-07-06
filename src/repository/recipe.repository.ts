import * as express from "express";
import { DatabaseError, RecipeNotFoundError } from "../common/htttp-exception";
import KnexDB from "../db/knex";
import AddRecipeWithTime from "../dto/add_recipe_with_time";
import RecipeDb from "../dto/recipe";
import UpdateRecipe from "../dto/update_recipe";

class RecipeRepository {
  recipeDB: typeof KnexDB;

  constructor() {
    this.recipeDB = KnexDB;
    this.recipeDB.init();
  }

  async listRecipes(): Promise<RecipeDb[]> {
    return new Promise((resolve, reject) => {
      this.recipeDB.db
        .select("id", "name", "cook_time_minutes", "time_added",
          this.recipeDB.db.raw(
            "ARRAY_REMOVE(ARRAY_AGG(ingredients.ingredient), NULL) as ingredients"
          )
        )
        .from("recipes")
        .leftJoin("ingredients", "recipes.id", "ingredients.recipe_id")
        .groupBy("recipes.id")
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(new DatabaseError());
        });
    });
  }

  async addRecipe(recipe: AddRecipeWithTime): Promise<RecipeDb> {
    return new Promise(async (resolve, reject) => {
      await this.recipeDB
        .db("recipes")
        .insert(
          {name: recipe.name, cook_time_minutes: recipe.cook_time_minutes, time_added: recipe.time_added},
          "id"
        )
        .then((result) => {
          const ingredientsToInsert = recipe.ingredients.map((elem) => {
            return { recipe_id: result[0], ingredient: elem };
          });
          this.recipeDB
            .db("ingredients")
            .insert(ingredientsToInsert)
            .then((_) => {
              console.log("returning");
              const resultRecipe = Object.assign({ id: result[0] }, recipe);
              resolve(resultRecipe as RecipeDb);
            });
        })
        .catch((err) => {
          console.log(err);
          reject(new DatabaseError());
        });
    });
  }

  async getRecipeById(recipe_id: number): Promise<RecipeDb> {
    return new Promise((resolve, reject) => {
      this.recipeDB
        .db("recipes")
        .select("id", "name", "cook_time_minutes", "time_added",
          this.recipeDB.db.raw(
            "ARRAY_REMOVE(ARRAY_AGG(ingredients.ingredient), NULL) as ingredients"
          )
        )
        .from("recipes")
        .leftJoin("ingredients", "recipes.id", "ingredients.recipe_id")
        .groupBy("recipes.id")
        .where("recipes.id", recipe_id)
        .then((recipe) => {
          if (recipe[0]) {
            resolve(recipe[0]);
          }
          reject(new RecipeNotFoundError());
        })
        .catch((err) => {
          reject(new DatabaseError());
        });
    });
  }

  async deleteRecipeById(recipe_id: number): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.recipeDB
        .db("recipes")
        .where("recipes.id", recipe_id)
        .del()
        .then((numOfDeleted) => {
          console.log(numOfDeleted);
          if (numOfDeleted != 0) {
            resolve(true);
          } else {
            reject(new RecipeNotFoundError());
          }
        })
        .catch((err) => {
          reject(new DatabaseError());
        });
    });
  }

  async updateRecipe(recipe_id: number, recipe: UpdateRecipe): Promise<RecipeDb> {
    // Ingredient update
    return new Promise((resolve, reject) => {
      const newIngredientsOfRecipe = recipe.ingredients || null;
      delete recipe.ingredients;

      this.recipeDB
        .db("recipes")
        .where("recipes.id", recipe_id)
        .update(recipe, ["id", "name", "cook_time_minutes", "time_added"])
        .then((updated) => {

          if (updated[0]) {
            if (newIngredientsOfRecipe != null) {

              this.recipeDB
                .db("ingredients")
                .where("ingredients.recipe_id", recipe_id)
                .del()
                .then((res) => {

                  const ingredientsToInsert = newIngredientsOfRecipe.map(
                    (elem) => {
                      return { recipe_id: recipe_id, ingredient: elem };
                    }
                  );
                  return this.recipeDB.db("ingredients").insert(ingredientsToInsert);

                })
                .then((_) => {
                  return this.getRecipeById(recipe_id);
                })
                .then((res) => {
                  resolve(res);
                });
            } else {
              this.getRecipeById(recipe_id).then((res) => {
                resolve(res);
              });
            }
          } else {
            return reject(new RecipeNotFoundError());
          }
        })
        .catch((err) => {
          reject(new DatabaseError());
        });
    });
  }
}

export default RecipeRepository;
