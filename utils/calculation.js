export const calc = {
    
    currentTimeStamp: () => {
        const todayTimeStamp = new Date();
        //to add GMT +5:30hrs in currentTimeStamp.
        todayTimeStamp.setHours(todayTimeStamp.getHours() + 5);
        todayTimeStamp.setMinutes(todayTimeStamp.getMinutes() + 30);
        return todayTimeStamp;
    },

    remDateGMT: (timeStamp) => {
        const prevTimeStamp = new Date(timeStamp);
        //to minus GMT -5:30hrs in previously added TimeStamp.
        prevTimeStamp.setHours(prevTimeStamp.getHours() - 5);
        prevTimeStamp.setMinutes(prevTimeStamp.getMinutes() - 30);
        return prevTimeStamp;
    }
}