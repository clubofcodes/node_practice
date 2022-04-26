export const calc = {
    
    currentTimeStamp: () => {
        const todayTimeStamp = new Date();
        //to add GMT +5:30hrs in currentTimeStamp.
        todayTimeStamp.setHours(todayTimeStamp.getHours() + 5);
        todayTimeStamp.setMinutes(todayTimeStamp.getMinutes() + 30);
        return todayTimeStamp;
    }
}