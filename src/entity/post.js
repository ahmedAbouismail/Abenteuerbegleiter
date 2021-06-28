class Post{
    constructor(createdTimestamp,location, title, context, image, like){
        this.loaction = location;
        this.title = title;
        this.context = context;
        this.image = image;
        this.like = like;
        this.createdTimestamp = createdTimestamp;
    }
}
export default Post;