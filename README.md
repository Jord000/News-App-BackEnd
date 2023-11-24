# News App API - Jordan Watson

If you wish to clone the repo and run locally you must create a .env.development file within the main news folder containing a link to the correct database. In this instance this will be PGDATABASE=nc_news. If you wish to run test data, a .env.test file can be created with the link PGDATABASE=nc_news_test in the same folder.

If you would like to visit the hosted site please visit :
https://news-app-87li.onrender.com

# Summary

This project hosts a database of articles with comments by users linked to each article. Each article can be searched as well as comments associated with that article. New posts can be made to existing articles.

# instructions to clone

.env files will be required to allow the database to work as above. Seed scripts are provided to begin by creating databases.

The dev-dependencies used are as follows: 
- husky 
- jest 
- jest-extended
- jes-sorted 
- pg-format 
- supertest

The dependencies used are as follows: 
- dotenv 
- express 
- pg

For testing use the scripts to populate the PSQL database and run test files through jest.
Created using node v18.13.0 & PostgresSQL v15.4
