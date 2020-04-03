console.log('Home Script Loaded');
console.log(moment());
//method to submit form data for new post using ajax

let dateFormatFn = function(dateString){
    let formattedDate = moment(dateString).format('MMMM DD, hh:mm A');
    return formattedDate;
}

$('.date-created').each(function(){
    let unformattedDate = $(this).text();
    let formattedDate = dateFormatFn(unformattedDate);
    $(this).text(formattedDate);
});

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
                let domPostItem = createDomPost(data.data.post);
                $('#posts-feed-container').prepend(domPostItem);
                $('#new-post-form')[0].reset();
            }, error: function(error){
                console.log(error.responseText);
            }
        })

    });
}

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

createPost();

