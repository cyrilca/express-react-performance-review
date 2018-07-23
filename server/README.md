# React based performance review platform
React.js + Express + Passport.js</br>
This app allows you to request and submit feedback about employees of your company</br>

### What is used:
- React + Redux
- Express / Passport.js / MongoDB + Mongoose

<img src="https://user-images.githubusercontent.com/9072649/43093713-7bcd747e-8eb9-11e8-919a-cf54b9b12f64.gif">

#### Usage 
Clone this repo
```
$ git clone https://github.com/cyrilca/express-react-performance-review.git
```

Go to the folder
```
$ cd express-react-performance-review
```

Go to the server folder
```
$ cd server
```

Install dependencies
```
$ npm install
```

Run mongo server
```
$ mongod
```

Run migrations to create sample data
```
$ npm run migrations
```

Rename .env.example to .env

Run server
```
$ npm run dev
```

Go back to the client folder
```
$ cd ..
```

Install dependencies
```
$ npm install
```

Run client
```
$ npm run dev
```

Go to localhost:8080

Accounts for testing:

admin@site.com:123456777 - Admin permission</br>
user1@site.com:123456777 - User permission</br>
user2@site.com:123456777 - User permission</br>
user3@site.com:123456777 - User permission</br>
