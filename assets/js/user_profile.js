console.log('user_profile script called');
// if(isFriendship) {%> 
//     <div class="field">
//         <a class="friendship-toggle-link" href="/friends/toggle?from=<%=locals.user._id%>&to=<%=currUser._id%>&toggle=0">Remove Friend</a>
//     </div> 
// <%}

// else {%> 
//     <div class="field">
//         <a class="friendship-toggle-link" href="/friends/toggle?from=<%=locals.user._id%>&to=<%=currUser._id%>&toggle=1">Add Friend</a>
//     </div> 
// <%}

$('.friendship-toggle-link').click((event)=>{
    event.preventDefault();
    let url = $('.friendship-toggle-link').attr('href');
    console.log(url);
    $.ajax({
        method: 'post',
        url: url,
        success: (data)=>{
            console.log(data);
        },
        error: (error)=>{
            console.log(error.responseText);
        }
    })
})