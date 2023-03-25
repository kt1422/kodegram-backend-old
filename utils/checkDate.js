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

    return time.toDateString();
}

const checkMDY = (createAt) =>{
    const date = new Date(createAt);
    const d = date.getDate();
    // const m = date.getMonth()+1;
    const m = date.toLocaleString('default', { month: 'long' });
    const y = date.getFullYear();
    const mdy = `${m} ${d}, ${y}`
    return mdy;
}

module.exports = {
    checkDate,
    checkMDY
}