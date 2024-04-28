import dotenv from "dotenv"
import "colors"
import dummyData from "./products.json" assert { type: "json" }
import { program } from "commander"
import connectDB from "./connect.js"
import Product from "../models/Product.js"
import inquirer from "inquirer"

dotenv.config()

const deleteData = async () => {
  await Product.deleteMany()
  console.log("Products deleted".red.inverse)
  process.exit()
}

const insertData = async () => {
  await Product.create(dummyData)
  console.log("Products Inserted".green.inverse)
  process.exit()
}

const start = async () => {
  connectDB(process.env.MONGO_URI)

  program.showHelpAfterError("(add --help for additional information)")
  program
    .name("maintain the data")
    .description("Delete or insert your data")
    .version("1.0.0")

  program
    .option("-d, --delete", "Delete the whole data")
    .option("-i, --insert", "Insert the dummy data (json file)")
    .action(async (option) => {
      if (Object.keys(option).length === 0) {
        console.log("'node draft.js --help' for additional information")
        process.exit()
      }
      if (Object.keys(option)[0] === "delete") {
        const answer = await inquirer.prompt({
          type: "confirm",
          name: "confirm",
          message: "U wanna delete the whole products?",
        })
        if (answer.confirm) {
          await deleteData()
        }
        process.exit()
      } else if (Object.keys(option)[0] === "insert") {
        const answer = await inquirer.prompt({
          type: "confirm",
          name: "confirm",
          message: "U wanna insert products from json file?",
        })
        if (answer.confirm) {
          await insertData()
        }
        process.exit()
      }
    })
  program.parse()
}
start()

process.on("unhandledRejection", (error) => {
  console.log(error)
  process.exit(1)
});
