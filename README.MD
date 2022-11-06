# Restaurants

A management system for Tabit restaurants and users. Premissions are given to users according their roles in the system.


## Prerequisites
The following technologies should be installed globally
* Node (preferred version / project version - 14.15.3)
* ts-node
* TypeScript (latest)
* Nodemon 
* MongoDB
* React


## Installation

Before running this project install node modules in both server & client with this command:

```
npm install
```

Run Server with the command:

```
nodemon server.ts
```

Run Client with the command:

```
nodemon npm run start
```


App includes authentication 
![Image](https://res.cloudinary.com/dtwqtpteb/image/upload/v1667694795/f0sorkhrjtppnd29snal.png
)

Successfuly authentication leads to management page
![Image](https://res.cloudinary.com/dtwqtpteb/image/upload/v1667694795/j4f9tcxyziw5qdknorxp.png
)

In case one of the details is incorrect, you are blocked by the system with a message
![Image](https://res.cloudinary.com/dtwqtpteb/image/upload/v1667694795/ujxgtteqbksjxfdaduk8.png
)

In case the logged in user has no premission due to his role, he won't be able to do some actions. In the example, Stav is a waiter and waiter has no premission to delete restaurant.
![Image](https://res.cloudinary.com/dtwqtpteb/image/upload/v1667694795/j3ndjif1g7osve8nxypb.png
)


