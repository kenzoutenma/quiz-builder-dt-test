# Full-Stack JS engineer test assessment - the Quiz Builder

## Start frontend and backend

### To start app at first run backend

```
cd ./backend
```

create .env:

```
DATABASE_URL="file:./dev.db"
PORT=3001
```

do migrations:

```
npm run prisma:generate && npm run prisma:migrate
```

run backend:

```
npm run build && npm run start
```

### Then start frontend

Create .env to point backend:

```
NEXT_PUBLIC_BACKEND_URL="http://localhost:3001/"
```

Build app:

```
npm run build
```

Start frontend:

```
npm run start
```
