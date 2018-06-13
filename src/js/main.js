console.log('meme00');

$(function() {
    const pathName = location.pathname
    const substring = pathName.substring(pathName.indexOf('/',1));
    const locationPath = '/'+location.pathname.split("/")[1];
    console.log(pathName);
    console.log(substring);
    console.log(locationPath);
    if ( locationPath !== ''){
    $('.links a[href="' + pathName + '"]').parent().addClass('active');
    $('.links a[href="' + locationPath + '"]').parent().addClass('active');
    }else{
        $('#home').addClass('active');
    }
});