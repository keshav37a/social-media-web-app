class ChatEngine{
    constructor(chatBoxId, userEmail){
        
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000');
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets');
        })

        self.socket.emit('join_room', {
            user_email: this.userEmail,
            chatroom: 'codeial'
        })

        self.socket.on('user_joined', function(data){
            console.log('a user joined ', data);
        })

        $('#send-message-btn').click((event)=>{
            event.preventDefault();
            let msg = $('#send-message-input-text').val();
            if(msg!=''){
                self.socket.emit('send_message', {
                    message: msg,
                    userEmail: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        })

        self.socket.on('recieve_message', function(data){
            console.log('message recieved: ', data.message);
            let email = data.userEmail;
            let className = 'rec-message-div';
            if(self.userEmail == email)
                className = 'sent-message-div';

            let newMessage = $('<span>');
            newMessage.append(data.message);
            newMessage.append('</span>');
            newMessage.addClass(className);

            let messageList = $('#message-list');
            messageList.append(newMessage);

            console.log(messageList);
        })
    }
}

