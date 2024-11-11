import { Model } from 'pocketto';

export class RecipeItem extends Model {
    static dbName = 'my-database';
    static collectionName = 'RecipeItems';

    name!: string;
    quantity!: number;
    unit!: string;
}

export class Recipe extends Model {
    static dbName = 'my-database';
    static collectionName = 'Recipes';

    name!: string;
    description!: string;
    popularity!: number;

    ingredients!: any[];
}