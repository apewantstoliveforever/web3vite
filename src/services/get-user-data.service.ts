import { db } from "./gun";

interface UserFavorites {
  images: string;
  books: string;
  songs: string;
  videos: string;
}

const fetchUserFavorites = async (username: string): Promise<UserFavorites> => {
  const result: UserFavorites = {
    images: "",
    books: "",
    songs: "",
    videos: "",
  };

  return new Promise((resolve, reject) => {
    db.get(`~@${username}`).on((userData: any) => {
      const keys = Object.keys(userData["_"][">"]);
      let pending = keys.length;

      if (pending === 0) {
        resolve(result);
        return;
      }

      keys.forEach((key) => {
        db.get(key)
          .get("favourites")
          .on((data: any) => {
            if (data) {
              result.images = data.images || "";
              result.books = data.books || "";
              result.songs = data.songs || "";
              result.videos = data.videos || "";
            }

            pending -= 1;
            if (pending === 0) {
              resolve(result);
            }
          });
      });
      //off the on if you want to stop listening to the data
      // db.get(`~@${username}`).off();
    });
  });
};

export { fetchUserFavorites };
