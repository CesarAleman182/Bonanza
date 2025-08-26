const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({message: 'Authentication is required'});
    }

    if(req.user.role !== 'admin'){
        return res.status(403).json({
            message: 'Admin acces is required'
        });
    }
    next();
}

export default isAdmin;