import { clerkClient } from "@clerk/express";

export const protectRoute = async(req,res,next)=>{
    if(!req.auth.userId){
        console.log("userId not found in request",req.auth.userId)
        return res.status(401).json({message:"Unauthorized - you must be logged in"})
    }
    next();
};

export const requireAdmin = async(req,res,next)=>{
    try {
        const currentUser = await clerkClient.users.getUser(req.auth.userId);
		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
        console.log("isAdmin",isAdmin)
        if(!isAdmin){
            return res.status(401).json({message:"Unauthorized - you must be an admin"}) 
        }
        next();
    } catch (error) {
        next(error)
    }
}