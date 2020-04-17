const nodeMailer = require('../config/nodemailer');

//exporting the newComment function
exports.newComment = (comment)=>{
    console.log('Inside newComment in comment_mailer.js');
    nodeMailer.transporter.sendMail({
        from : 'keshav37a@gmail.com',
        to : comment.user.email,
        subject : 'Comment Published',
        html: '<h1>Yup, your comment is now published!</h1>'
    }, (err, info) => {
        if(err){console.log('error in sending mail', err); return;}
        
        console.log('Message sent', info);
        return;
    });
}