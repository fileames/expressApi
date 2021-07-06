import AddRecipe from "./add_recipe";

export default interface AddRecipeWithTime extends AddRecipe {
  time_added: string;
}
