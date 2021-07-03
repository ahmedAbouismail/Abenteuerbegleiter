class Post{
    constructor(userId, postId,createdTimestamp, location, title, context, imageUrl, like){
        this.userId = userId;
        this.postId = postId;
        this.loaction = location;
        this.title = title;
        this.context = context;
        this.imageUrl = imageUrl;
        this.like = like;
        this.createdTimestamp = createdTimestamp;
    }
}
export default Post;