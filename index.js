
const { app, express } = require('./server')
const { saucesRouter } = require('./routers/sauces.router')
const { authRouter } = require('./routers/auth.router')
const port = 3000
const path = require('path')
const rateLimit = require('express-rate-limit')
const helmet = require("helmet")

// Connection to database
require('./mongo')



// Middleware
app.use(express.json())
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);
// Rate limit 

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

app.use('/api/sauces', saucesRouter)
app.use('/api/auth', authRouter)











// Listen

app.use("/images", express.static(path.join(__dirname, 'images')))
app.listen(port, () => console.log("Listen on port: " + port));



