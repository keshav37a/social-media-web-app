const nodeMailer = require('../config/nodemailer');

//exporting the newComment function
exports.newComment = (comment)=>{
    
    //We have already defined the previous part of the path in nodemailer.js
    let htmlString = nodeMailer.renderedTemplate({comment: comment}, 'comments/new_comment.ejs')

    nodeMailer.transporter.sendMail({
        from : 'keshav37a@gmail.com',
        to : comment.user.email,
        subject : 'Comment Published',
        html: htmlString
    }, (err, info) => {
        if(err){console.log('error in sending mail', err); return;}
        
        console.log('Message sent', info);
        return;
    });
}