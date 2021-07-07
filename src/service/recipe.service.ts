import RecipeRepository from "../repository/recipe.repository";
import RecipeDb from "../dto/recipe";
import RecipeWithIng from "../dto/recipe_with_ingredients";
import AddRecipe from "../dto/add_recipe";
import UpdateRecipe from "../dto/update_recipe";

class RecipeService {
  recipeRepository: RecipeRepository;

  constructor() {
    this.recipeRepository = new RecipeRepository();
  }

  async listRecipes(): Promise<RecipeWithIng[]> {
    return new Promise((resolve, reject) => {

      this.recipeRepository.listRecipes().then((res) => {
        return resolve(res);
      });

    });
  }

  async getRecipeById(recipe_id: number): Promise<RecipeWithIng> {
    return new Promise((resolve, reject) => {

      this.recipeRepository.getRecipeById(recipe_id)
      .then((res) => {
        return resolve(res);
      }).catch((err)=>{
        reject(err);
      });
    
    });
  }

  async updateRecipe(recipe: UpdateRecipe): Promise<RecipeWithIng> {
    return new Promise((resolve, reject) => {

      this.recipeRepository.updateRecipe(recipe)
      .then(async (recipe_on_db) => {
        console.log(recipe_on_db)
        console.log(recipe.ingredients)

        if(recipe.ingredients){
          this.recipeRepository.deleteIngredientsOfRecipe(recipe.id)
          .then((_)=>{

            if( recipe.ingredients.length > 0){
              this.recipeRepository.addIngredients(recipe.id, recipe.ingredients)
                .then((ingredients) => {
                  resolve({...recipe_on_db, ingredients: ingredients} as RecipeWithIng);
                })
            }else{
                resolve({...recipe_on_db, ingredients: recipe.ingredients} as RecipeWithIng);
            }
            
          })
        }
        else{
          const recipeOnBd = await this.getRecipeById(recipe_on_db.id);
          resolve(recipeOnBd);
        }
        
      }).catch((err)=>{
        reject(err);
      });

    });
  }

  async deleteRecipeById(recipe_id: number): Promise<Boolean> {
    return new Promise((resolve, reject) => {
 
      this.recipeRepository.deleteRecipeById(recipe_id).then((res) => {
        return resolve(res);
      }).catch((err)=>{
        reject(err);
      });

    });
  }

  async addRecipe(recipe: AddRecipe): Promise<RecipeWithIng> {
    return new Promise((resolve, reject) => {
      try {
        
        recipe.time_added = new Date(Date.now()).toISOString();

        this.recipeRepository.addRecipe(recipe).then((recipe_on_db) => {
          this.recipeRepository.addIngredients(recipe_on_db.id, recipe.ingredients).then((ingredients)=>{
            resolve({...recipe_on_db, ingredients: ingredients} as RecipeWithIng);
          })
        }).catch((err) => {
          reject(err);
        });

      } catch (err) {
        reject(err);
      }
    });
  }
}

export default RecipeService;
