console.log('user_profile script called');

$('.friendship-toggle-link').click((event)=>{
    event.preventDefault();
    let url = $('.friendship-toggle-link').attr('href');
    console.log(url);
    $.ajax({
        method: 'post',
        url: url,
        success: (data)=>{
            console.log(data);
            let isFriendship = data.data.isFriendship;
            let from = data.data.from;
            let to = data.data.to;
            let text = '';
            let toggle = -1;
            if(isFriendship){
                toggle = 0;
                text = 'Remove Friend'
                $('.friendship-toggle-link').attr('href', `/friends/toggle?from=${from}&to=${to}&toggle=${toggle}`);
                $('.friendship-toggle-link').text(text);
            }
            else{
                toggle = 1;
                text = 'Add Friend'
                $('.friendship-toggle-link').attr('href', `/friends/toggle?from=${from}&to=${to}&toggle=${toggle}`);
                $('.friendship-toggle-link').text(text);
            }
        },
        error: (error)=>{
            console.log(error.responseText);
        }
    })
})