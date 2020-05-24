let dateFormatFn = function(dateString){
    console.log('DateFormat fn called');
    let formattedDate = moment(dateString).format('MMMM DD, hh:mm A');
    return formattedDate;
}

let allDates = $('.date-created');

$(allDates).each((index, element)=>{
    let dateDiv = $(element);
    let dateString = dateDiv.text();
    let formattedDate = dateFormatFn(dateString);
    dateDiv.text(formattedDate);
});