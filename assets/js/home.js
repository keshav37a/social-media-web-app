console.log('Home Script Loaded');
// console.log(moment());
//method to submit form data for new post using ajax

let dateFormatFn = function(dateString){
    let formattedDate = moment(dateString).format('MMMM DD, hh:mm A');
    return formattedDate;
}

let createPost = function(){
    // console.log('createPost called');
    let newPostForm = $('#new-post-form');
    newPostForm.submit(function(e){
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/posts/create-post',
            data: newPostForm.serialize(),
            success: function(data){
                let domPostItem = createDomPost(data.data.post);
                $('#posts-feed-container').prepend(domPostItem);
                $('#new-post-form')[0].reset();
            }, error: function(error){
                console.log(error.responseText);
            }
        })

    });
}


let deletePost = function(deleteLink){
    // console.log('deletePost called');
    $(deleteLink).click(function(e){
        e.preventDefault();
        // console.log('deletePost ajax called');
        $.ajax({
            type: "get",
            url: $(deleteLink).prop('href'),
            success: function(data) {
                $(`#post-${data.data.post_id}`).remove();
            }, error: function(err){
                console.log(error.responseText);
            }
        });

    })
}

let createComment = function(createCommentForm){
    // console.log('createComment called');
    // console.log(`${createCommentForm}`);
    $(createCommentForm).submit(function(e){
        e.preventDefault();
        console.log($(createCommentForm).attr('action'));
        $.ajax({
            type: 'post',
            data: createCommentForm.serialize(),
            url: $(createCommentForm).attr('action'),
            success: function(data){
                let commentsList = $(`#comments-container-post-${data.data.comment.post}`);
                let newComment = createDomComment(data);
                commentsList.prepend(newComment);
                console.log(data);
            },error: function(error){
                console.log('error:', error.responseText);
            }
        });
    })
}



$('.date-created').each(function(){
    let unformattedDate = $(this).text();
    let formattedDate = dateFormatFn(unformattedDate);
    $(this).text(formattedDate);
});

$('.delete-post-button').each(function(){
    let deleteLink = $(this);
    // console.log(`DeleteLink: ${deleteLink}`);
    deletePost(deleteLink);
});

$('.comment-submit-form').each(function(){
    let createCommentItem = $(this);
    console.log(`createCommentItem: ${createCommentItem}`);
    createComment(createCommentItem);
});




//method to create a post in DOM
let createDomPost = function(i){
    return $(`<div id="post-${i._id}" class="single-post-container">
                    <div>
                        <form method="POST" action="/posts/delete-post/?postOwner=${i.loggedInUser._id}&postId=${i._id}">
                            <div class="item-delete-container">
                                <div class="content">${i.content}</div>    
                                <div><button type="submit">Delete Post</button></div>
                            </div>    
                        </form>
                    </div>

                    <div>${i.loggedInUser.name}</div>
                    <div class="date-created">${i.createdAt}</div>

                    
                    <div>
                        <form method="POST" action="/comments/post-comment/?post=${i._id}&user=${i.loggedInUser._id}">
                            <textarea name="content" cols="30" rows="1"></textarea>
                            <button type="submit">Post Comment</button>
                        </form>
                    </div>
                    <div class="comments-container">
                    </div>    
                </div>
            `)}

let createDomComment = function(data){
        return `<div class="single-comment-container">
                    <div>
                        <form method="POST" action="/comments/delete-comment/?cId=${data.data.comment._id}&pId=${data.data.comment.post}&uId=${data.data.comment.user}">
                            <div class="item-delete-container">
                                <div class="content">${data.data.comment.content}</div>
                                <button type="submit">Delete Comment</button> 
                            </div>
                        </form>        
                    </div>
                    <div>${data.data.userName}</div>
                    <div class="date-created">${data.data.comment.createdAt}</div>
                </div>`;
}

createPost();
createComment();
