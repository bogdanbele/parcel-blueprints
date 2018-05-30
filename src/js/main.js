import message from "./message";
message('Hello World!');

console.log('meme00');

$(function() {
    const pathName = location.pathname
    const substring = pathName.substring(pathName.lastIndexOf('/')+1);
    const locationPath = location.pathname.split("/")[1];
    console.log(pathName);
    console.log(substring);
    console.log();
    if ( locationPath !== ''){
    $('.links a[href="' + pathName + '"]').addClass('active');
    }else{
        $('#home').addClass('active');
    }
});