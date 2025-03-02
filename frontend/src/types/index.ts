export interface Song{
    _id: string,
    title: string,
    artist: string,
    albumId: string | null,
    imageUrl: string,
    duration: number,
    audioUrl: string,
    createdAt:string,
    updatedAt:string
}

export interface Album{
    _id: string,
    title: string,
    artist: string,
    imageUrl: string,
    releaseYear: number,
    songs: Song[]
}

export interface Stats{
    totalSongs: number,
    totalAlbums: number,
    totalArtists: number
    totalUsers: number
}