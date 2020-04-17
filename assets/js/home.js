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

                addSinglePostToAjax(domPostItem);
              
                $(' #posts-feed-container').prepend(domPostItem);

                $('#new-post-form')[0].reset();

                new Noty({
                    theme: 'relax',
                    text: "Post Created",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();

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

                new Noty({
                    theme: 'relax',
                    text: "Post Deleted",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();

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
        console.log($(this).prop('href'));
        e.preventDefault();
        $.ajax({
            type: "get",
            url: $(deleteLinkItem).prop('href'),
            success: function(data) {
                console.log('on success: deleteComment');
                console.log(data);
                $(`#comment-${data.data.commentId}`).remove();

                new Noty({
                    theme: 'relax',
                    text: "Comment deleted",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();

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
                console.log(data);
                let postId = data.data.comment.post;
                let allCommentsContainerForPost = $(`#comments-container-post-${postId}`);
                let singleCommentContainerNew = createDomComment(data);
                
                

                addSingleCommentToAjaxDelete(singleCommentContainerNew);
                allCommentsContainerForPost.prepend(singleCommentContainerNew);

                new Noty({
                    theme: 'relax',
                    text: "Comment added",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();

                // $(createCommentForm).reset();
            },error: function(error){
                console.log('error:', error.responseText);
            }
        });
    })
}

let addSinglePostToAjax = function(postContainer){

    //adding delete post to ajax
    let deletePostLink = $(' .delete-post-link', postContainer);
    deletePost(deletePostLink);

    //adding create comment to ajax
    let commentSubmitForm = $(' .comment-submit-form', postContainer);
    createComment(commentSubmitForm);

    //adding all comments to ajax
    addAllCommentsToAjax(postContainer);
    
}

let addAllCommentsToAjax = function(postContainer){
    let commentsContainer = $(' .comments-container', postContainer);
    commentsContainer.each(function(){
        let singleCommentContainer = $(this);
        addSingleCommentToAjaxDelete(singleCommentContainer);
    })
}

let addSingleCommentToAjaxDelete = function(singleCommentContainer){
    let deleteCommentLink = $(' .delete-comment-link', singleCommentContainer);
    console.log('delete-comment-link');
    console.log(deleteCommentLink);
    deleteComment(deleteCommentLink);
}


let addElementsToAjax = function(){
    createPost();
    let postsFeedContainer =  $('#posts-feed-container').children();

    //loop through all the posts
    postsFeedContainer.each(function(){
        let postContainer = $(this);
        console.log(postContainer);
        addSinglePostToAjax(postContainer);
    })
}

let formatDateSingle = function(item){
    
}


addElementsToAjax();

// $('.date-created').each(function(){
//     let unformattedDate = $(this).text();
//     let formattedDate = dateFormatFn(unformattedDate);
//     $(this).text(formattedDate);
// });

// $('.comment-submit-form').each(function(){
//     console.log('create comment for each called');
//     let createCommentItem = $(this);
//     // console.log(`createCommentItem: ${createCommentItem}`);
//     createComment(createCommentItem);
// });


// $('.delete-post-link').each(function(){
//     console.log('delete post for each called');
//     let deleteLink = $(this);
//     // console.log(`DeleteLink: ${deleteLink}`);
//     deletePost(deleteLink);
// });


// $('.delete-comment-link').each(function(){
//     console.log('delete comment for each called');
//     let deleteLink = $(this);
//     // console.log(`delete-comment-button: ${deleteLink}`);
//     deleteComment($(deleteLink));
// })





//method to create a post in DOM
let createDomPost = function(i){
    return $(`<div id="post-${i._id}" class="single-post-container">
                    <div>
                        <div class="item-delete-container">
                            <div class="content">${i.content}</div>    
                            <div><a id="link-${i._id}" class="delete-post-link" href="/posts/delete-post/?postOwner=${i.loggedInUser._id}&postId=${i._id}">X</a></div>
                        </div>    
                    </div>

                    <div>${i.loggedInUser.name}</div>
                    <div class="date-created">${i.createdAt}</div>

                    
                    <div>
                        <form id="new-comment-form-${i._id}" class="comment-submit-form" method="POST" action="/comments/post-comment/?post=${i._id}&user=${i.loggedInUser._id}">
                            <textarea name="content" cols="30" rows="1"></textarea>
                            <button type="submit">Post Comment</button>
                        </form>
                    </div>
                    <div class="comments-container" id="comments-container-post-${i._id}">
                    </div>    
                </div>
            `)}

let createDomComment = function(data){
        return `<div class="single-comment-container">
                    <div>
                        <div class="item-delete-container">
                            <div class="content">${data.data.comment.content}</div>
                            <a id="delete-link-comment-${data.data.comment._id}" class="delete-comment-link" href="/comments/delete-comment/?cId=${data.data.comment._id}&pId=${data.data.comment.post}&uId=${data.data.comment.user}">X</a>
                        </div>
                    </div>
                    <div>${data.data.userName}</div>
                    <div class="date-created">${data.data.comment.createdAt}</div>
                </div>`;
}


// createComment();
// deletePost();
// deleteComment();

//Issues
//on new post new comments arent reflecting using ajax
//Delete not returning any data after ajax call
