console.log('Home Script Loaded');

//For getting likes status of user on login // likeable liked or not
let userId = $('#user-profile-link').data()['userId'];
let likesLikeableIds = $('.like-btn-img');
if(userId!=undefined){
    $.ajax({
        type: 'get',
        url: `/likes/${userId}`,
        success: (data)=>{
            let likeableArray = data.data;
            for(let i=0; i<likeableArray.length; i++){
                let likeableItem = likeableArray[i];
                let likeableId = likeableItem.likeable;
                let likesLikeableImage = $(`#likeable-${likeableId}`);
                $(likesLikeableImage).css('filter', 'invert(37%) sepia(59%) saturate(3298%) hue-rotate(196deg) brightness(98%) contrast(102%)');
            }
        },
        error: (err)=>{
            console.log(err.responseText);
        }
    })
}

//method to submit form data for new post using ajax
let newNotification = function(text){
    new Noty({
        theme: 'relax',
        text: text,
        type: 'success',
        layout: 'topRight',
        timeout: 1500
        
    }).show();
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
                let domPostItem = createDomPost(data.data.post);
                addSinglePostToAjax(domPostItem);
              
                $(' #posts-feed-container').prepend(domPostItem);
                $('#new-post-form')[0].reset();
                newNotification("Post Created");

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
                console.log(data);
                $(`#post-${data.data.post_id}`).remove();
                newNotification("Post Deleted");

            }, error: function(err){
                console.log(err.responseText);
            }
        });
    })
}

let deleteComment = function(deleteLinkItem){
    console.log('DeleteComment called in home.js script');
    console.log('deleteLinkItem in ', deleteLinkItem);
    $(deleteLinkItem).click(function(e){
        e.preventDefault();
        console.log('deleteComment called on click ', e.target.id);
        console.log($(this).prop('href'));
        $.ajax({
            type: "get",
            url: $(deleteLinkItem).prop('href'),
            success: function(data) {
                console.log('on success: deleteComment');
                console.log(data);
                $(`#comment-${data.data.commentId}`).remove();
                newNotification("Comment Deleted");

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
                
                console.log('singleCommentContainerNew: ', $(singleCommentContainerNew));
                let deleteLink = $('.delete-comment-link', $(singleCommentContainerNew));
                deleteComment(deleteLink);
                addSingleCommentToAjaxDelete($(singleCommentContainerNew));

                let likeContainer = $('.like-container', $(singleCommentContainerNew));
                addSingleLikeToAjax($(likeContainer));

                // addAllLikesToAjax($(singleCommentContainerNew));

                allCommentsContainerForPost.prepend(singleCommentContainerNew);
                newNotification('Comment Added');

                // $(createCommentForm).reset();
            },error: function(error){
                console.log('error:', error.responseText);
            }
        });
    })
}

let likePostOrComment = function(likeLinkItem){
    console.log(`likePostOrComment called`);
    $(likeLinkItem).click((e)=>{
        e.preventDefault();
        $.ajax({
            type: "post",
            url: $(likeLinkItem).prop('href'),
            success: function(data) {
                likeCountAndColorManipulation(likeLinkItem, data);
            }, error: function(err) {
                console.log(err.responseText);
            }
        });
    })
}

//Add color and count on like click
let likeCountAndColorManipulation = (likeLinkItem, data)=>{
    
    let likeLinkBtn = $('.like-btn-img', likeLinkItem);
    let likeContainer = $(likeLinkItem).parent().parent();
    let likeCount = $('.like-count', likeContainer);
    
    let totalLikeCount = data.data.likeable.likes.length;
    $(likeCount).remove();
    if(totalLikeCount>0){
        let likeCountDiv = `<div class="like-count">${totalLikeCount}</div>`;
        $(likeLinkItem).parent().parent().append(likeCountDiv);
    }
    if(data.data.isLiked==true){
        $(likeLinkBtn).css('filter', 'invert(37%) sepia(59%) saturate(3298%) hue-rotate(196deg) brightness(98%) contrast(102%)');
    }   
    else{
        $(likeLinkBtn).css('filter', 'invert(0%) sepia(100%) saturate(20%) hue-rotate(39deg) brightness(93%) contrast(107%)');
    }
}

let addAllLikesToAjax = function(postOrCommentContainer){
    let likeContainers = $('.like-container', postOrCommentContainer);
    $(likeContainers).each((index, element)=>{
        let singleLikeContainer = $(element);
        addSingleLikeToAjax(singleLikeContainer);
    })
}

let addSingleLikeToAjax = function(likeContainer){
    let likeLink = $('.like-link', likeContainer);
    likePostOrComment(likeLink);
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

    //adding likesForPost to ajax
    addAllLikesToAjax(postContainer);    
}

let addAllCommentsToAjax = function(postContainer){
    let allCommentsContainer = $(' .comments-container', postContainer);
    let allSingleCommentContainers = $('.single-comment-container', allCommentsContainer);
    allSingleCommentContainers.each((index, element)=>{
        let singleCommentContainer = $(element);
        addSingleCommentToAjaxDelete(singleCommentContainer);
    })
}

let addSingleCommentToAjaxDelete = function(singleCommentContainer){
    console.log('addSingleCommentToAjaxDelete called');
    let deleteCommentLink = $('.delete-comment-link', singleCommentContainer);
    console.log('delete-comment-link: in addSingleCommentToAjaxDelete', deleteCommentLink);
    deleteComment(deleteCommentLink);
}


let addElementsToAjax = function(){
    createPost();
    let postsFeedContainer =  $('#posts-feed-container').children();

    //loop through all the posts
    $(postsFeedContainer).each((index, element)=>{
        let postContainer = $(element);
        addSinglePostToAjax($(postContainer));
    })
}

addElementsToAjax();

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
                    <div class="date-created">${moment(i.createdAt).format('MMMM DD, hh:mm A')}</div>

                    
                    <div>
                        <form id="new-comment-form-${i._id}" class="comment-submit-form" method="POST" action="/comments/post-comment/?post=${i._id}&user=${i.loggedInUser._id}">
                            <textarea name="content" cols="30" rows="1"></textarea>
                            <button type="submit">Post Comment</button>
                        </form>
                    </div>
                    <div class="like-container">
                        <div><a class="like-link" href="/likes/toggle?id=${i._id}&type=post"><img id=likeable-${i._id} class="like-btn-img" data-likeable-id="${i._id}" src="https://image.flaticon.com/icons/svg/633/633991.svg" alt="like-btn-post"></a></div>
                        <div class="like-text">Like</div>
                    </div>    
                    <div class="comments-container" id="comments-container-post-${i._id}">
                    </div>    
                </div>
            `)}

let createDomComment = function(data){
        return `<div class="single-comment-container" id="comment-${data.data.comment._id}">
                    <div>
                        <div class="item-delete-container">
                            <div class="content">${data.data.comment.content}</div>
                            <a id="delete-link-comment-${data.data.comment._id}" class="delete-comment-link" href="/comments/delete-comment/?cId=${data.data.comment._id}&pId=${data.data.comment.post}&uId=${data.data.comment.user._id}" type="submit">X</a>
                        </div>
                    </div>
                    <div>${data.data.userName}</div>
                    <div class="date-created">${moment(data.data.comment.createdAt).format('MMMM DD, hh:mm A')}</div>
                    <div class="like-container">
                        <div><a class="like-link" href="/likes/toggle?id=${data.data.comment._id}&type=comment"><img id=likeable-${data.data.comment._id} class="like-btn-img" data-likeable-id="${data.data.comment._id}" src="https://image.flaticon.com/icons/svg/633/633991.svg" alt="like-btn-post"></a></div>
                        <div class="like-text">Like</div>
                    </div>    
                </div>`;
}


// createComment();
// deletePost();
// deleteComment();

//Issues
//on new post new comments arent reflecting using ajax
//Delete not returning any data after ajax call

//Working
//Create post on ajax working for new post
//Create comment on ajax working
//Delete comment not working on ajax for new comment
//Like Post working on ajax for new post