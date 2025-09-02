const logger = (req, res, next)=>{
    console.log(`${dateTime.toISOString()} | ${req.method} ${req.url}`);
    next();
}

export default logger;