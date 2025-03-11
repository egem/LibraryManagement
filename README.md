# Library Management Case Study

## Overview

This repository contains a case study for a **Library Management** system. It provides the schema setup, database configuration, and dummy data necessary for the management of books, users, and borrowings in a library system.

The case study involves setting up a PostgreSQL database and running scripts to create the required tables and indices, followed by inserting dummy data for testing purposes.

## Documentation

All relevant documentation for this project can be found in the `doc` folder. The documents in this folder provide detailed information about the project setup, schema structure, and other relevant details.

## Setup Instructions

### 1. Set up the Database

To set up the database, follow the instructions in the documentation located under `doc/postgresql/setup-database.md`. This will guide you through the process of setting up PostgreSQL, creating the database, and running the necessary setup scripts.

### 2. Install Dependencies

After setting up the database, install the required packages by running the following command:

    $ npm install

This will load all the dependencies specified in the package.json file.

### 3. Serve the Application

To start the server, run:

    $ npm start

If you'd like to watch for changes and automatically restart the server when changes are made, you can use the following command:

    $ npm run serve

This will enable automatic server restarts during development.

### 4. Run Postman Tests

To run the Postman tests, use the following command:

    $ npm run postman-tests

Please ensure that the server is running before executing the Postman tests, as the tests require the server to be active in order to interact with the endpoints.

### 5. Run Unit Tests

To run the unit tests for the project, execute:

    $ npm run test

This will run the unit tests and display the results in the terminal. Due to limited time, only some of the unit tests have been written.
