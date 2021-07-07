export default interface UpdateRecipe {
  id: number;
  name?: string;
  cook_time_minutes?: number;
  ingredients?: string[];
}
