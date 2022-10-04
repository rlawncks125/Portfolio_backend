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
            // heroku Addon postgres 사용 시 설정
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

## DB 가비아 DB 호스팅으로 바꾼후 문제점

1.  <!-- postgres 제공하는 UUID를 확장 ( uuid-ossp ) 을 설치하지 못하여 사용 못함 -->
    <!-- @PrimaryGeneratedColumn('uuid') 사용 x -->

2.  <!-- Idle_in_transaction_session_timeout 에러 -->

<!-- save사용시 Idle_in_transaction_session_timeout에러 발생 -->

typoerm save() => insert, update로 명시하는 기능으로 사용

## typeOrm save() -> insert,update,delete 로 교체

- [] restaurnt
- [o] room
- [o] shop-item ( ireceipt , shop-item )
- [o] shop-user
- [] user

removeBasketItem => 받는 index인자 배열로 변경 inclueds로 체크
