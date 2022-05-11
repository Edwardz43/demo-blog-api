## Description

Demo project, a blog backend API with [Nest](https://github.com/nestjs/nest) framework.

## Installation

```bash
$ npm install
```

## DB Setup

```bash
# initialize the database
$ npm run db:setup

# seed the database
$ npm run db:seed
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run start:prod
```

## Docker Support
```bash
$ docker build -t {IMAGE_NAME} .
$ docker run -p 3000:3000 -p 50001:50001 {IMAGE_NAME}
```
