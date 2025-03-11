## Setup Instructions

### Prerequisites

Before setting up the database, ensure that you have PostgreSQL installed. If not, you can download it from [PostgreSQL Downloads](https://www.postgresql.org/download/).

### Steps to Set Up the Database

1. **Connect to PostgreSQL:**

   First, open the terminal and connect to PostgreSQL by running the following command:

    ```sh
    $ psql postgres

2. **Create Database:**

    Next, create the database by running this command (replace library_management with your desired database name if necessary):

    ```sh
    $ CREATE DATABASE library_management;

3. **Run the Setup Script:**

    Finally, execute the script to create the schema and insert dummy data:

    ```sh
    $ ./scripts/setup.sh library_management
