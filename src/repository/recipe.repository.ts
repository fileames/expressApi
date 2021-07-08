import { DatabaseError, RecipeNotFoundError } from "../common/htttp-exception";
import KnexDB from "../db/knex";
import AddRecipe from "../dto/add_recipe";
import RecipeDb from "../dto/recipe";
import RecipeWithIng from "../dto/recipe_with_ingredients";
import UpdateRecipe from "../dto/update_recipe";

class RecipeRepository {
  recipeDB: typeof KnexDB;

  constructor() {
    this.recipeDB = KnexDB;
  }

  async listRecipes(): Promise<RecipeWithIng[]> {
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
        .catch((_) => {
          reject(new DatabaseError());
        });
    });
  }

  async addIngredients(recipe_id: number, ingredients: string[]): Promise<string[]>{
    return new Promise(async (resolve, reject) => {

      const ingredientsToInsert = ingredients.map((elem) => {
        return { recipe_id: recipe_id, ingredient: elem };
      });
      this.recipeDB
        .db("ingredients")
        .insert(ingredientsToInsert)
        .returning("ingredients.ingredient")
        .then((resultIng) => {
          resolve(resultIng);
        })
        .catch((_) => {
          reject(new DatabaseError());
        });
      })

  }
  

  async addRecipe(recipe: AddRecipe): Promise<RecipeDb> {
    return new Promise(async (resolve, reject) => {
       this.recipeDB
        .db("recipes")
        .insert(
          {name: recipe.name, cook_time_minutes: recipe.cook_time_minutes, time_added: recipe.time_added}
        )
        .returning("*")
        .then((result) => {
          resolve(result[0]);
        })
        .catch((_) => {
          reject(new DatabaseError());
        });
    });
  }

  async getRecipeById(recipe_id: number): Promise<RecipeWithIng> {
    return new Promise((resolve, reject) => {
      this.recipeDB
        .db("recipes")
        .select("id", "name", "cook_time_minutes", "time_added",
          this.recipeDB.db.raw(
            "ARRAY_REMOVE(ARRAY_AGG(ingredients.ingredient), NULL) as ingredients"
          )
        )
        .from("recipes")
        .where("recipes.id", recipe_id)
        .leftJoin("ingredients", "recipes.id", "ingredients.recipe_id")
        .groupBy("recipes.id")
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
          if (numOfDeleted != 0) {
            resolve(true);
          } else {
            reject(new RecipeNotFoundError());
          }
        })
        .catch((_) => {
          reject(new DatabaseError());
        });
    });
  }

  async deleteIngredientsOfRecipe(recipe_id: number): Promise<Boolean>{
    return new Promise((resolve, reject) => {
      this.recipeDB
        .db("ingredients")
        .where("ingredients.recipe_id", recipe_id)
        .del()
        .then((_) => {
          resolve(true)
        })
        .catch((_)=>{
          reject(new DatabaseError());
        })
    });
  }

  async updateRecipe(recipe: UpdateRecipe): Promise<RecipeDb> {
    // Ingredient update
    return new Promise((resolve, reject) => {

      const recipeOnDb = {...recipe};
      delete recipeOnDb.ingredients;

      this.recipeDB
        .db("recipes")
        .where("recipes.id", recipe.id)
        .update(recipeOnDb, ["id", "name", "cook_time_minutes", "time_added"])
        .then((updated) => {

          if (updated[0]) {
            resolve(updated[0]);
          } else {
            return reject(new RecipeNotFoundError());
          }
        })
        .catch((_) => {
          reject(new DatabaseError());
        });
    });
  }
}

export default RecipeRepository;
