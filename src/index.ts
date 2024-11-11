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
app.get('/', async(req: Request, res: Response) => {
  const allRecipes = await Recipe.all()
  console.log(allRecipes)
  res.render("home", {allRecipes});
});

// Create New Recipe
app.get('/newRecipe', async (req: Request, res: Response) => {
  
  const newRecipe = new Recipe({
    name: faker.food.dish(),                          // name 
    description: faker.food.description(),            // description
    popularity: faker.number.int({ min: 1, max: 5 }), // popularity
  });

  console.log(newRecipe)
  await newRecipe.save()
  res.render('home');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});