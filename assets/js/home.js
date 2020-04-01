console.log('Home Script Loaded');
var datesCollection = document.getElementsByClassName('date-created');
console.log(`datesCollection : ${typeof(datesCollection)} ${datesCollection}`);
dateFormatting(datesCollection);

function dateFormatting(datesCollection){
    for (item of datesCollection){
        console.log(`item: ${item}`);
        let dateString = item.innerHTML;
        let dateStringArray = dateString.split(' ');
        console.log(`dateString: ${dateString}`);
        console.log(`dateStringArray: ${dateStringArray}`);
        let time = dateStringArray[4];
        let month = dateStringArray[1];
        let date = dateStringArray[2];
    
        let finalResult = `${month} ${date}, ${time.substring(0, 5)}`;
        item.innerHTML = finalResult;
    }
}

