# E-Commerce-Server
This is the server-side component of an e-commerce application, built using [Node.js](https://nodejs.org/en) and [Express](https://expressjs.com/). The server provides various endpoints to manage products, users, and more for the e-commerce platform.
## Features
- **Product Management**: CRUD operations for managing Categories, SubCategories, Brands, and Products.
- **User Authentication**: User registration, login, logout, changing password, and authentication using JWT.
- **Search and Filtering**: Search products and filter by category, price, etc.
- **Pagination**: Paginated results for product listing and other endpoints.
- **Authorization and Role-based Access**: Control access to endpoints based on user roles.
- **Error Handling**: Centralized error handling and response formatting.
- **Brute-Force Attack Protection**: Implement rate limiting to prevent brute-force attacks on login endpoints.
## Ongoing Features
### CSRF Protection
- **Description**: Implement CSRF tokens and validation on sensitive endpoints to prevent CSRF attacks.
- **Status**: Planned.
### Reviews, and Wishlist
- **Status**: In progress.
### Orders, Payment
- **Status**: Planned.
### Deployment
- **Status**: Planned.
## Prerequisites
Before running the server, ensure you have the following installed:
- [Node.js](https://nodejs.org/en)
- [MongoDB](https://www.mongodb.com/)
## Getting Started
1. Clone this repository.
2. Install dependencies:
```bash
cd e-commerce-server
npm install
```
3. Set up environment variables: Create a `.env` file in the root directory and define the following variables:
```
PORT

BASE_URL=http://localhost:PORT

MONGO_URI

NODE_ENV=development or production

JWT_SECRET
JWT_LIFETIME

EMAIL_HOST
EMAIL_PORT
EMAIL_USER
EMAIL_PASSWORD
```
Please note that I used [Nodemailer](https://www.nodemailer.com/) and Gmail to send the password reset code.

4. Create a `uploads` folder to store uploaded images.
5. Start the server:
```
npm start
```
6. The server should now be running at `http://localhost:PORT or 5000`
## API Testing
you can use [Postman](https://www.postman.com/) to test APIs

## Find a bug?
feel free to submit an issue (with or without a fix) or an improvement for this project. I would appreciate that.
## License
This project is licensed under the ISC License.
#
Let me know if you need assistance!
