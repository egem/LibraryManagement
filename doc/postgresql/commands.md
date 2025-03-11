This document has been written to show the common commands which can be used in Postgresql shell.

- Create database as "library_management" and connect to it

  ```sh
  $ CREATE DATABASE library_management;
  $ \c library_management

- List databases

  ```sh
  $ \list

- List users

  ```sh
  $ \du

- Show current database

  ```sh
  $ \c

- List tables

  ```sh
  $ \dt

- List rows in a users table

  ```sh
  $ SELECT * FROM users;

- Show indices

  ```sh
  $ \di

- Show current user

  ```sh
  $ SELECT current_user;
