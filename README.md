# 주의

```
# parm() 로 받은값은 string 으로 들어옴


```

방 신청 유저 목록 ( 설정 )
방 정보 변경 ( 설정 )

# Heroku 배포

## Procfile를 이용한 heroku Configure Dynos 명령어 수정

```js
//  Procfile
web: npm run start:prod // 실행할 명령어
```

## typeOrm 설정

### 수정전

```js
TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_ROOT,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [`dist/**/*.entity{ .ts,.js}`],
      // synchronize: process.env.NODE_ENV === 'production' ? false : true,
      synchronize: true,
    }),

```

### 수정후

```js
// 수정후
  TypeOrmModule.forRoot({
      ...(process.env.NODE_ENV === 'production'
        ? // heroku 배포시 url을 사용하여 연결
          {
            url: process.env.DATABASE_URL,
            // heroku error
            // self signed sertificate
            extra: {
              ssl: { rejectUnauthorized: false },
            },
          }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_ROOT,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
          }),
      //  타입은 url사용해도 정의해야함
      // 'mariadb' 'postgres' ...
      type: process.env.DB_TYPE as any,
      entities: [`dist/**/*.entity{ .ts,.js}`],
      synchronize: process.env.NODE_ENV === 'production' ? false : true,
    }),
```
