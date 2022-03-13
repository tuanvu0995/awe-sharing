Awe-transfer


# Setup
Clone source to local desktop adn install dependencies:

```
git clone git@github.com:tuanvu0995/awe-sharing.git
cd awe-sharing
yarn install
```

# Setup database

With SQLite3

```
mkdir tmp
node ace migration:run
```

If need demo database
```
node ace db:seed
```