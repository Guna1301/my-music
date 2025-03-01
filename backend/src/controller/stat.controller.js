import Song from "../models/song.model.js";
import User from "../models/user.model.js";
import Album from "../models/album.model.js";

export const getStats = async (req, res, next) => {
    try {
        const [totalSongs, totalUsers, totalAlbums,uniqueArtitst] = await Promise.all([
            Song.countDocuments(),
            User.countDocuments(),
            Album.countDocuments(),
            Song.aggregate([
                {
                    $unionWith:{
                        coll:"albums",
                        pipeline:[]
                    }
                },{
                    $group:{
                        _id:"$artist"
                    }
                },{
                    $count:"count"
                }
            ])
        ])
        res.status(200).json({
            totalSongs,
            totalUsers,
            totalAlbums,
            totalArtists:uniqueArtitst[0]?.count||0
        })
        
    } catch (error) {
        console.log("error in getStats", error);
        next(error)   
    }
}