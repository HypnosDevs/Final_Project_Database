// example allowedRoles = ['admin','product manager']
exports.checkUserRole = (allowedRoles) => {
    return (req, res, next) => {

        if (!req.session.userId) {
            return res.status(401).json({ message: 'You must be logged in to access this resource.' });
        }

        const userRole = req.session.user.role;
        if (allowedRoles.includes('ADMIN')) {
            return next();
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'You do not have permission to access this resource.' });
        }


        return next();
    };
};