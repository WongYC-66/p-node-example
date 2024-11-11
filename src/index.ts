import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path = require("path");

import { faker } from '@faker-js/faker';
import { RecipeItem, Recipe } from "./models/model"
import { DatabaseManager } from 'pocketto';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// pocketto setup
DatabaseManager.connect('default', {
  encryption: false,
  silentConnect: false,
  dbName: 'my-database',
  adapter: 'leveldb',
  auth: {
    username: 'admin',
    password: 'password'
  },
});

// set the view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Home 
app.get('/', async (req: Request, res: Response) => {
  const allRecipes = await Recipe.query().with('ingredients').get()
  // const allRecipes = await Recipe.relationship().ingredients().all()

  const allRecipeItems = await RecipeItem.all()
  res.render("home", { allRecipes, allRecipeItems });
});

// get random1
app.get('/1', async (req: Request, res: Response) => {
  const allRecipes = await Recipe.query().with('ingredients').get()
  const randomRecipe = allRecipes.sort(_ => Math.random() - 0.5).pop()
  res.json(randomRecipe);
});

// Create New Recipe
app.get('/newRecipe', async (req: Request, res: Response) => {

  // random recipe from fakerJS
  const newRecipe: Recipe = new Recipe({
    name: faker.food.dish(),
    description: faker.food.description(),
    popularity: faker.number.int({ min: 1, max: 5 }),
    ingredients: generateRandomRecipeItems(),
  });

  function generateRandomRecipeItems(): RecipeItem[] {
    // random ingredients of quantity 2~4
    const ingredientCount = Math.floor(Math.random() * 4) + 1
    const returnArr: RecipeItem[] = []

    for (let i = 0; i < ingredientCount; i++) {
      const newRecipeItem = new RecipeItem({
        name: faker.food.ingredient(),
        quantity: faker.number.int({ min: 1, max: 5 }),
        unit: "unit",
      })
      returnArr.push(newRecipeItem)
    }
    return returnArr
  }

  if(newRecipe.ingredients.length == 0){
    throw("Error: ingredients emtpy")
  }
  console.log(newRecipe)

  await newRecipe.save()  // save

  res.redirect('/');

});

// Delete last recipe
app.get('/deleteLastRecipe', async (req: Request, res: Response) => {

  let allRecipes = await Recipe.all()

  const lastRecipe = allRecipes.at(-1)

  if (lastRecipe) {
    await lastRecipe.delete(true)   // hard delete with(true)
  }

  res.redirect('/');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});