export default interface RecipeWithIng {
  id: number;
  name: string;
  cook_time_minutes: number;
  time_added: string;
  ingredients: string[];
}
