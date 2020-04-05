

console.log('Home Script Loaded');
// console.log(moment());
//method to submit form data for new post using ajax

let dateFormatFn = function(dateString){
    console.log('DateFormat fn called');
    let formattedDate = moment(dateString).format('MMMM DD, hh:mm A');
    return formattedDate;
}

let createPost = function(){
    console.log('createPost called');
    let newPostForm = $('#new-post-form');
    newPostForm.submit(function(e){
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/posts/create-post',
            data: newPostForm.serialize(),
            success: function(data){
                console.log('on success: newPost');

                let unformattedDate = data.data.post.createdAt;
                let formattedDate = dateFormatFn(unformattedDate);
                data.data.post.createdAt = formattedDate;

                let domPostItem = createDomPost(data.data.post);

                deletePost($('.delete-post-button', domPostItem));
                // createComment($('.comment-submit-form', domPostItem));
                $('.comment-submit-form', domPostItem).each(function(){
                    console.log($(this));
                    createComment($(this));
                })
                $('.delete-comment-button', domPostItem).each(function(){
                    deleteComment($(this));
                })

                $('#posts-feed-container').prepend(domPostItem);

                $('#new-post-form')[0].reset();
            }, error: function(error){
                console.log(error.responseText);
            }
        })

    });
}


let deletePost = function(deleteLink){
    console.log('deletePost called');
    $(deleteLink).click(function(e){
        e.preventDefault();
        // console.log('deletePost ajax called');
        $.ajax({
            type: "get",
            url: $(deleteLink).prop('href'),
            success: function(data) {
                console.log('on success: deletePost');
                $(`#post-${data.data.post_id}`).remove();
            }, error: function(err){
                console.log(error.responseText);
            }
        });

    })
    return;
}

let deleteComment = function(deleteLinkItem){
    console.log('DeleteComment called in home.js script');
    $(deleteLinkItem).click(function(e){
        console.log('deleteComment called on click');
        e.preventDefault();
        $.ajax({
            type: "get",
            url: $(deleteLinkItem).prop('href'),
            success: function(data) {
                console.log('on success: deleteComment');
                console.log(data);
                $(`#comment-${data.data.commentId}`).remove();
            }, error: function(err) {
                console.log(err.responseText);
            }
        });
    });
}

let createComment = function(createCommentForm){
    console.log(`Create Comment called`);
    $(createCommentForm).submit(function(e){
        e.preventDefault();
        console.log('createComment called on submit');
        console.log($(createCommentForm).attr('action'));
        $.ajax({
            type: 'post',
            data: createCommentForm.serialize(),
            url: $(createCommentForm).attr('action'),
            success: function(data){
                console.log('on success: createComment');
                let commentsList = $(`#comments-container-post-${data.data.comment.post}`);
                let formattedDate = dateFormatFn(data.data.comment.createdAt);
                data.data.comment.createdAt = formattedDate;
                let newComment = createDomComment(data);

                $('.delete-comment-button', newComment).each(function(){
                    deleteComment($(this));
                })

                $(commentsList).prepend(newComment);
                console.log(data);
                console.log(`${createCommentForm}`);
                // $(createCommentForm).reset();
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

$('.comment-submit-form').each(function(){
    console.log('create comment for each called');
    let createCommentItem = $(this);
    // console.log(`createCommentItem: ${createCommentItem}`);
    createComment(createCommentItem);
});


$('.delete-post-button').each(function(){
    console.log('delete post for each called');
    let deleteLink = $(this);
    // console.log(`DeleteLink: ${deleteLink}`);
    deletePost(deleteLink);
});


$('.delete-comment-button').each(function(){
    console.log('delete comment for each called');
    let deleteLink = $(this);
    // console.log(`delete-comment-button: ${deleteLink}`);
    deleteComment($(deleteLink));
})





//method to create a post in DOM
let createDomPost = function(i){
    return $(`<div id="post-${i._id}" class="single-post-container">
                    <div>
                        <div class="item-delete-container">
                            <div class="content">${i.content}</div>    
                            <div><a class="delete-post-button" href="/posts/delete-post/?postOwner=${i.loggedInUser._id}&postId=${i._id}">X</a></div>
                        </div>    
                    </div>

                    <div>${i.loggedInUser.name}</div>
                    <div class="date-created">${i.createdAt}</div>

                    
                    <div>
                        <form class="comment-submit-form" method="POST" action="/comments/post-comment/?post=${i._id}&user=${i.loggedInUser._id}">
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
                        <div class="item-delete-container">
                            <div class="content">${data.data.comment.content}</div>
                            <div><a href="/comments/delete-comment/?cId=${data.data.comment._id}&pId=${data.data.comment.post}&uId=${data.data.comment.user}">X</a></div>
                        </div>
                    </div>
                    <div>${data.data.userName}</div>
                    <div class="date-created">${data.data.comment.createdAt}</div>
                </div>`;
}

createPost();
// createComment();
// deletePost();
// deleteComment();

//Issues
//on new post new comments arent reflecting using ajax
//Delete not returning any data after ajax call
