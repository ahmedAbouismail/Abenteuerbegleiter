class Post{
    constructor(userId, postId,createdTimestamp, location, title, context, imageUrl, likes){
        this.userId = userId;
        this.postId = postId;
        this.location = location;
        this.title = title;
        this.context = context;
        this.imageUrl = imageUrl;
        this.likes = likes;
        this.createdTimestamp = createdTimestamp;
    }
}
export default Post;