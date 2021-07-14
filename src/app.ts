import express from "express";
import cors from "cors";
import errorHandler from "./middleware/error.middleware"
import KnexDB from "./db/knex";
import recipeController from "./controller/recipe.controller";

class RecipeApp {
  app: express.Application;
  appRouter: express.Router;

  constructor() {
    this.app = express();
    this.appRouter = express.Router();
  }

  init() {
    return new Promise((resolve, reject) => {
      try {
        this.appConfig();
        this.routeConfig();
        KnexDB.init()
          .then((_)=>{
            this.app.use(errorHandler);
            console.log("Configured App");
            resolve(true);
          }).catch((err)=>{
            reject(err);
          });
      } catch (error) {
        reject(error);
      } 
    })
  }

  private routeConfig() {
    const apiPath: string = "/api";
    this.app.use(apiPath, this.appRouter);
    this.appRouter.use("/recipes", recipeController);
  }

  listen(): Promise<boolean> {
    return new Promise((resolve, reject) => {

      const port = Number(process.env.APP_PORT || 3000);
      this.app.listen(port, () => {
        console.log("Express server started on port: " + port);
        resolve(true);
      });

    });
  }

  private appConfig() {
    this.app.use(cors());
    this.app.use(express.json());
  }
}

const app = new RecipeApp();

export default app;
