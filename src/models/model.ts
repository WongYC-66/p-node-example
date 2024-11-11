import { Model, Relational, HasMany, BelongsTo, BelongsToMany, HasOne } from 'pocketto';

@Relational
export class RecipeItem extends Model {
    static dbName = 'my-database';
    static collectionName = 'RecipeItems';

    name!: string;
    quantity!: number;
    unit!: string;
    
    @HasOne("Recipe")
    recipe!: Recipe;
}

@Relational
export class Recipe extends Model {
    
    static dbName = 'my-database';
    static collectionName = 'Recipes';
    
    name!: string;
    description!: string;
    popularity!: number;
    
    @HasMany("RecipeItem")
    ingredients!: RecipeItem[];
}