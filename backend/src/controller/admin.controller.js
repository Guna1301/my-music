import Song from "../models/song.model.js"
import Album from "../models/album.model.js"
import cloudinary from "../lib/cloudinary.js"

//healper function for cloduinaru uploads
const uploadToCloduinary = async (file)=>{
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath,{
            resource_type: "auto",
        })
        return result.secure_url; 
    } catch (error) {
        console.log("Error in uplodToCloudinary",error)
        throw new Error("Error uploading to cloduinary")
    }
}

export const createSong = async (req,res,next)=>{
    try {
        if(!req.files || !req.files.audioFile || !req.files.imageFile){
            return res.status(400).json({message:"Please upload all files"})
        }
        const {title, artist, albumId, duration} = req.body;
        const audioFile = req.files.audioFile
        const imageFile = req.files.imageFile

        const audioUrl = await uploadToCloduinary(audioFile)
        const imageUrl = await uploadToCloduinary(imageFile)

        const song = new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId:albumId||null
        })
        await song.save();
        // if song belongs to an album, then updating the album's song array
        if(albumId){
            await Album.findByIdAndUpdate(albumId,{
                $push:{songs:song._id}
            })
        }
        res.status(201).json(song)
    } catch (error) {
        console.log("error in creating song",error);
        next(error)
    }
}

export const deleteSong = async(req,res,next)=>{
    try {
        const {id} = req.params;

        const song = await Song.findById(id);
        // if song belongs to album album should aslo be updated
        if(song.albumId){
            await Album.findByIdAndUpdate(song.albumId,{
                $pull:{songs:song._id}
            })
        }
        await Song.findByIdAndDelete(id);
        res.status(200).json({message:"Song deleted successfully"})
    } catch (error) {
        console.log("error in deleting song controller",error);
        next(error);
    }
}

export const createAlbum = async(req,res,next)=>{
    try {
        const {title, artist, releaseYear} = req.body;
        const {imageFile} = req.files;
        const imageUrl = await uploadToCloduinary(imageFile);

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear
        })
        await album.save();
        res.status(200).json(album)
    } catch (error) {
        console.log("error in creating album",error);
        next(error)
    }
}

export const deleteAlbum = async(req,res,next)=>{
    try {
        const {id} = req.params;
        await Song.deleteMany({albumId:id})
        await Album.findByIdAndDelete(id);
        res.status(200).json({message:"Album deleted successfully"})
    } catch (error) {
        console.log("error in deleting album",error);
        next(error)
    }
}

export const checkAdmin = async(req,res,next)=>{
    res.status(200).json({admin:true})
}