//Function to check the date is valid or not
const checkDate = (unmaskedDate) => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + mm + dd;
    console.log('today', today);

    //console.log('unmasked2', unmaskedDate);
    const year = unmaskedDate[4] + unmaskedDate[5] + unmaskedDate[6] + unmaskedDate[7];
    //console.log(year);
    const month = unmaskedDate[2] + unmaskedDate[3];
    //console.log(month);
    const day = unmaskedDate[0] + unmaskedDate[1];
    //console.log(day);

    const flippedDate = year + month + day;
    console.log(flippedDate);


    const checkValidity = (day, month, year) => {

        //a year is a leap year if it is divisible by 4 and 100 and 400
        //if the year is a leap year return true, otherwise false
        const isLeap = (year) => {
            if((year % 4 == 0) && (year % 100 != 0) && (year % 400 == 0))
                return true;
            else
                return false;
        };

        const max_yr = 9999;
        const min_yr = 1;

        if(year < min_yr || year > max_yr ) { // 0 < month < 13 and 0 < day < 32 are already checked by masked input
            return false;
        }

            //check date for special months
            //April, June, September and November only have 30 days
            //Feburary have 29 days if its a leap year, otherwise only 28 days
        if( month === 2 ) {
            if(isLeap(year) && day <= 29) {
                return true;
            }
            if (day <= 28) {
                return true;
            }
            return false;
        }

            //if it is April, June, September and November, we ensure day <= 30 days
        if ( month === 4 || month === 6 || month === 9 || month === 11 ) {
            if(day <= 30) {
                return true;
            }
            else {
                return false;
            }
        }
        return true;
    };


    if (flippedDate < today) {
        return false;
    }
    
    if (checkValidity(day, month, year)){
        return flippedDate;
    }
    return null;
};


//Function takes in the array itemList (containing all the item data), today's date (in yyyymmdd)
//and numDays (variable representing the num of days btn today and the expiry date)
//and check which items are expiring in numDays time
//returns a set of items which are expiring in numDays time
//items expiring today = items expiring in 0 days' time and so on
/*const checkExpiring = (flippedDate, today, todayDay, todayMonth, todayYear, numDays) => {

    if (numDays === 0) {
        return today;
    }

    //we first find the date which is numDays away from today
    let endYear = todayYear;
    let endMonth = todayMonth;
    let endDay = todayDay;

    if (numDays === 365) {
        if (!isLeap(endYear)) {
            endYear += 1;
            numDays -= 365;
            return (endYear + endMonth + endDay);
        }
    }

    while (numDays > 365 ) {
        if (isLeap(endYear)) {
            endYear += 1;
            numDays -= 366;
        }
        else {
            endYear += 1;
            numDays -= 365;
        }
    }

    //check how many days left in this month
    const findDaysLeft = (todayMonth, todayDay, endYear) => {
        //we have 29 days in feb if leap year, otherwise 28 days
        if( todayMonth === 2 ) {
            if(isLeap(endYear)) {
                return (29 - todayDay);
            }
            return (28 - todayDay);
        }

        //if it is April, June, September and November, we only have 30 days
        if ( todayMonth === 4 || todayMonth === 6 || todayMonth === 9 || todayMonth === 11 ) {
            return (30 - todayDay);
        }
        return (31 - todayDay);
    };

    //if it reaches here, numDays < 365
    findDaysLeft(todayMonth, todayDay, endYear);

    while (numDays > 0) {
        if( endMonth === 2 && numDays >= 28) {
            if(isleap(endYear) && numDays >= 29) {
                return addMonthsRecursive((numDays - 29), (endMonth + 1), isEndYearLeap);
            }
            return addMonthsRecursive((numDays - 28), (endMonth + 1), isEndYearLeap);
        }
        
        if (numDays >= 31) {
            //if it is April, June, September and November, we only have 30 days
            if ( endMonth === 4 || endMonth === 6 || endMonth === 9 || endMonth === 11 ) {
                return addMonthsRecursive((numDays - 30), (endMonth + 1), isEndYearLeap);
            }
            return addMonthsRecursive((numDays - 31), (endMonth + 1), isEndYearLeap);
        }
    }
        

        
    }

    let isEndYearLeap = isLeap(endYear);

    if (numDays >= 31) {
        addDaysRecursive(numDays, endMonth, isEndYearLeap)
    }

    if (numDays < daysLeft) {
        endDay += numDays;
        return (endYear + endMonth + endDay);
    }

    //else we add days left
    endDay += daysLeft;
    numDays -= daysLeft;


    
};*/

const checkExpiring = (itemList, numDays) => {
    const endDate = new Date(new Date().getTime() + (numDays*24*60*60*1000));

    const dd = String(endDate.getDate()).padStart(2, '0');
    const mm = String(endDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = endDate.getFullYear();

    const flippedEndDate = yyyy + mm + dd;
    console.log(flippedEndDate);

    const filtered = [];

    let numItems = itemList.length;
    let i = 0;

    while (i < numItems) {
        if (itemList[i].flippedDate <= flippedEndDate) {
            filtered.push(itemList[i])
        }
        i += 1;
    }
    return filtered;
    
};

const searchFor = (itemList, search) => {
    const searched = [];

    let numItems = itemList.length;
    console.log(numItems);
    let i = 0;

    while (i < numItems) {
        if (itemList[i].desc === search) {
            searched.push(itemList[i])
        }
        i += 1;
    }
    return searched;
};

const crossCheck = (inventoryList, toBuyList) => {
    const checked = [];

    let numInventory = inventoryList.length;
    let numToBuy = toBuyList.length;
    
    let i = 0;
    let j = 0;

    while (i < numToBuy) {
        while (j < numInventory) {
            if (toBuyList[i].desc === inventoryList[j].desc) {
                checked.push(inventoryList[j])
            }
            j += 1;
        }
        j = 0;
        i += 1;
    }
    return checked;
};

export { checkDate , checkExpiring, searchFor, crossCheck};