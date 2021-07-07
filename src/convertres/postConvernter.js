var postConventer={
    toFirestore: function name(post) {
        return{
            userId: post.userId,
            postId : post.postId,
            createdTimestamp: post.createdTimestamp,
            loaction: post.loaction,
            title: post.title,
            context: post.context,
            imageUrl: post.imageUrl,
            likr: post.like,
        };
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        console.log(data);
    }
}