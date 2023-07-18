const checkDate = (createAt) =>{
    const time = new Date(createAt);
    const now = new Date();
    const diff = (now.getTime() - time.getTime()) / 1000;

    if (diff < 60) {
        return 'just now';
    } else if (diff < 3600) {
        return Math.round(diff / 60) + 'm';
    } else if (diff < 86400) {
        return Math.round(diff / 3600) + 'h';
    } else if (diff < 604800) {
        return Math.round(diff / 86400) + 'd';
    } else if (diff < 31536000) {
        return Math.round(diff / 604800) + 'w';
    } else if (diff >= 31536000) {
        return Math.round(diff / 31536000) + 'y';
    }
}

const checkMDY = (createAt) =>{
    const date = new Date(createAt);
    const d = date.getDate();
    const m = date.toLocaleString('default', { month: 'long' });
    const y = date.getFullYear();
    const mdy = `${m} ${d}, ${y}`
    return mdy;
}

const chatDate = (createAt) => {
    const dateCreated = new Date(createAt);
    const now = new Date();
    const diff = (now.getTime() - dateCreated.getTime()) / 1000;

    if (diff < 604800) {
        const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        const day = weekday[dateCreated.getDay()];
        var hours = dateCreated.getHours();
        var minutes = dateCreated.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = day + ' ' + hours + ':' + minutes + '' + ampm;
        return strTime;
    } else {
        const d = dateCreated.getDate();
        const m = dateCreated.toLocaleString('default', { month: 'long' });
        const y = dateCreated.getFullYear();
        const mdy = `${m} ${d}, ${y}`
        return mdy;
    }
}

module.exports = {
    checkDate,
    checkMDY,
    chatDate
}