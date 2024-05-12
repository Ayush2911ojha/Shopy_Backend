const express = require('express')
const app = express()
const { default: mongoose } = require('mongoose')
const cors = require('cors')

const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const { createProduct } = require('./controllers/Product.controller');

const productsRouter = require('./routes/products.routes')
const brandsRouter = require('./routes/Brand.routes')
const categoriesRouter = require('./routes/Category.routes')
const userRouter = require('./routes/User')
const authRouter = require('./routes/Auth')
const cartRouter = require('./routes/Cart')
const orderRouter = require('./routes/Order')

const { User } = require('./models/User.model')

const { isAuth, sanitizeUser } = require('./services/common')
const SECRET_KEY = 'SECRET_KEY';
// JWT options
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY; // TODO: should not be in code;


//middelewares

app.use(
  session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false // don't create session until something stored
  })
)
app.use(passport.authenticate('session'))

app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH']
  })
)

app.use(express.json()) // to parse req.body
app.use('/products',isAuth(), productsRouter.router)
app.use('/categories',isAuth(), categoriesRouter.router)
app.use('/brands',isAuth(), brandsRouter.router)
app.use('/users',isAuth(), userRouter.router)
app.use('/auth', authRouter.router)
app.use('/cart',isAuth(), cartRouter.router)
app.use('/orders',isAuth(), orderRouter.router)

// Passport Strategies
passport.use(
  'local',
  new LocalStrategy(async function (username, password, done) {
    // by default passport uses username
    try {
      const user = await User.findOne({ email: username })
      console.log(username, password, user)
      if (!user) {
        return done(null, false, { message: 'invalid credentials' }) // for safety
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        'sha256',
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: 'invalid credentials' })
          }
          const token = jwt.sign(sanitizeUser(user), SECRET_KEY)
          done(null, token) // this lines sends to serializer
        }
      )
    } catch (err) {
      done(err)
    }
  })
)

passport.use(
    'jwt',
    new JwtStrategy(opts, async function (jwt_payload, done) {
      console.log({ jwt_payload });
      try {
        const user = await User.findOne({ id: jwt_payload.sub });
        if (user){
          return done(null, sanitizeUser(user)); // this calls serializer
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  console.log('serialize', user)
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role })
  })
})

// this changes session variable req.user when called from authorized request

passport.deserializeUser(function (user, cb) {
  console.log('de-serialize', user)
  process.nextTick(function () {
    return cb(null, user)
  })
})

main().catch(err => console.log(err))

async function main () {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
  console.log('database connected')
}

main().catch(err => console.log(err))
async function main () {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
  console.log('db connected')
}

// app.get('/', (req, res) => {
//   res.setHeader('Content-Type', 'application/json')
//   res.json({ status: 'success' })
// })



app.listen(8080, () => {
  console.log('server is running  ')
})
