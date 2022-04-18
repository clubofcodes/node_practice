# CRUD - Operations

## About

- This branch contains basic APIs which can perform simple CRUD operations in USER collection of local mongoDB as well as cloud mongodb cluster.

## Features

- `(Get HTTP Method)` Get all active users which has null value in deleted_at field.
- `(POST HTTP Method)` Add user(first_name, last_name, username, email, dob, status) with validations and timestamps.
- `(Patch HTTP Method via params)` Update user deleted_at to current timestamp which will behave as deleted data.
- `(Patch HTTP Method via body)` To set user status as active to inactive or vice-versa.

## Installation

Download this project zip or clone:

```bash
#To clone in local system.
git clone [https://gitlab.com/rahulj.inexture/node_practice.git](https://gitlab.com/rahulj.inexture/node_practice.git)

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
