# Product APIs

## About

- CRUD branch contains basic APIs which can perform simple CRUD operations in USER collection of local mongoDB as well as cloud mongodb cluster.
- Store info branch contains demo of cookies and sessions.
- In Auth branch, added password field in user schema which will be encrypted and used for authorization.
- Mail branch will be helpful to send mail using nodemailer npm package.
- Listing of all products with other CRUD operations in product branch. Even remaining and sold out quantity of product.
- User_role branch manages the login route for admin and customer.

## Features

- `(Get HTTP Method)` Get all active users which has null value in deleted_at field.
- `(Post HTTP Method)` Add user(first_name, last_name, username, email, dob, status) with validations and timestamps.
- `(Patch HTTP Method via params)` Update user deleted_at to current timestamp which will behave as deleted data.
- `(Patch HTTP Method via body)` To set user status as active to inactive or vice-versa.
- `(Get HTTP Method)` To set type of user's(available, deleted and total) quantity in cookie.
- `(Post HTTP Method)` - User registration with encrypted password field and user login which will generate token to access authorized routes.
- `(Post HTTP Method)` - To send mail.

## Installation

Download this project zip or clone:

###### To clone in local system.
- git clone [https://gitlab.com/rahulj.inexture/node_practice.git](https://gitlab.com/rahulj.inexture/node_practice.git)

###### After succesfully clone follow below steps.

```bash
# Replace proje-dir with directory name.
cd proje-dir

#To shift at crud branch.
git fetch
git checkout crud

# To install all node/npm packages listed in package.json file.
npm i
```

## To run the project

Create .env file in root dir and Set enviornment variables

```bash
PORT = YOUR_DESIRED_PORT_NUMBER
DB_NAME = LOCAL SYSTEM MONGODB_DATABASE_NAME
```

In the project directory, you can run:

```bash
npm start
```

## FYI

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) which is default port to view project in your browser.

## NodeApp Screenshots.

- Home Page | Default Page.

![Alt](./public/images/AppHomePage.jpg?raw=true "HomePage")

- Get API Response | Users List Page.

![Alt](./public/images/UListPage.jpg?raw=true "HomePage")
