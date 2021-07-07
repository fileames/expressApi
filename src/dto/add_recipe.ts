export default interface AddRecipe {
  name: string;
  cook_time_minutes: number;
  ingredients: string[];
  time_added?: string;
}