import { checkDate, checkExpiring, searchFor, crossCheck } from "../components/foodinventory/CheckExp";

//test CheckDate
let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
let yyyy = today.getFullYear();

today = dd + mm + yyyy;
let flipped = yyyy + mm + dd;

let nextYear = String(parseInt(today) + 1);
let flippedNextYear = String(parseInt(flipped) + 10000);

//dates with day > 31 or/and month > 12 or/and year < 0 or/and year > 9999 are already handled by other functions
test.each`
    date       | expected
    ${today} | ${flipped} //valid date
    ${nextYear} | ${flippedNextYear} //valid date
    ${"20072022"} | ${false} //expired
    ${"00000000"} | ${false} //expired
`("Return $expected when $date is entered", ({date, expected}) => {
    expect(checkDate(date)).toBe(expected);
});


//test CheckExpiring

//func takes in the list of items to scan and the numDays (num of days before item expires)
const tomorrow = new Date(new Date().getTime() + (1*24*60*60*1000));

dd = String(tomorrow.getDate()).padStart(2, '0');
mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); //January is 0!
yyyy = tomorrow.getFullYear();

const flippedTomorrow = yyyy + mm + dd;

const theDayAfter = new Date(new Date().getTime() + (2*24*60*60*1000));
dd = String(theDayAfter.getDate()).padStart(2, '0');
mm = String(theDayAfter.getMonth() + 1).padStart(2, '0'); //January is 0!
yyyy = theDayAfter.getFullYear();

const flippedTheDayAfter = yyyy + mm + dd;

const thirtyDaysAfter = new Date(new Date().getTime() + (30*24*60*60*1000));
dd = String(thirtyDaysAfter.getDate()).padStart(2, '0');
mm = String(thirtyDaysAfter.getMonth() + 1).padStart(2, '0'); //January is 0!
yyyy = thirtyDaysAfter.getFullYear();

const flippedThirtyDaysAfter = yyyy + mm + dd;

const h127DaysAfter = new Date(new Date().getTime() + (127*24*60*60*1000));
dd = String(h127DaysAfter.getDate()).padStart(2, '0');
mm = String(h127DaysAfter.getMonth() + 1).padStart(2, '0'); //January is 0!
yyyy = h127DaysAfter.getFullYear();

const unmaskedDate = dd + mm + yyyy;
const flipped127DaysAfter = yyyy + mm + dd;

//itemlist1 cases
const itemList1 = [ {desc:"A", flippedDate:"20072022"}, {desc:"B", flippedDate:flipped}, 
                    {desc:"C", flippedDate: flipped}, {desc: "D", flippedDate: flippedTomorrow}, 
                    {desc: "E", flippedDate: flippedTheDayAfter}, {desc: "F", flippedDate: flippedTomorrow},
                    {desc: "G", flippedDate: flippedThirtyDaysAfter} ]

//0 day's time
const expectedList10 = [ {desc:"A", flippedDate:"20072022"}, {desc:"B", flippedDate:flipped}, 
                    {desc:"C", flippedDate: flipped} ]

//1 day's time
const expectedList11 = [ {desc:"A", flippedDate:"20072022"}, {desc:"B", flippedDate:flipped}, 
                    {desc:"C", flippedDate: flipped}, {desc: "D", flippedDate: flippedTomorrow}, 
                    {desc: "F", flippedDate: flippedTomorrow} ]

//3 days' time
const expectedList13 = [ {desc:"A", flippedDate:"20072022"}, {desc:"B", flippedDate:flipped}, 
                    {desc:"C", flippedDate: flipped}, {desc: "D", flippedDate: flippedTomorrow}, 
                    {desc: "E", flippedDate: flippedTheDayAfter}, {desc: "F", flippedDate: flippedTomorrow} ]

//30 days' time
const expectedList130 = [ {desc:"A", flippedDate:"20072022"}, {desc:"B", flippedDate:flipped}, 
                    {desc:"C", flippedDate: flipped}, {desc: "D", flippedDate: flippedTomorrow}, 
                    {desc: "E", flippedDate: flippedTheDayAfter}, {desc: "F", flippedDate: flippedTomorrow},
                    {desc: "G", flippedDate: flippedThirtyDaysAfter}]                    

//itemlist2 cases
const itemList2 = [ {desc: "D", flippedDate: flippedTomorrow}, {desc: "E", flippedDate: flipped127DaysAfter, unmaskedDate: unmaskedDate},
                    {desc: "G", flippedDate: flippedThirtyDaysAfter}, {desc: "E", flippedDate: flippedTheDayAfter},
                    {desc:"C", flippedDate: flippedTheDayAfter}, {desc: "F", flippedDate: flippedTomorrow} ]

//0 days' time
const expectedList20 = []

//1 days' time
const expectedList21 = [ {desc: "D", flippedDate: flippedTomorrow}, {desc: "F", flippedDate: flippedTomorrow} ]

//3 days' time
const expectedList23 = [ {desc: "D", flippedDate: flippedTomorrow}, {desc: "E", flippedDate: flippedTheDayAfter},
                         {desc:"C", flippedDate: flippedTheDayAfter}, {desc: "F", flippedDate: flippedTomorrow} ]

//30 days' time
const expectedList230 = [ {desc: "D", flippedDate: flippedTomorrow},
                         {desc: "G", flippedDate: flippedThirtyDaysAfter}, 
                         {desc: "E", flippedDate: flippedTheDayAfter},
                         {desc:"C", flippedDate: flippedTheDayAfter}, {desc: "F", flippedDate: flippedTomorrow} ]                         

//127 days' time
const expectedList2127 = [ {desc: "D", flippedDate: flippedTomorrow}, {desc: "E", flippedDate: flipped127DaysAfter, unmaskedDate: unmaskedDate},
                         {desc: "G", flippedDate: flippedThirtyDaysAfter}, 
                         {desc: "E", flippedDate: flippedTheDayAfter}, {desc:"C", flippedDate: flippedTheDayAfter}, 
                         {desc: "F", flippedDate: flippedTomorrow} ]

//testing with item List 1
test.each`
    itemList | numDays  | expected
    ${itemList1} | ${0} | ${expectedList10}
    ${itemList1} | ${1} | ${expectedList11}
    ${itemList1} | ${3} | ${expectedList13}
    ${itemList1} | ${18} | ${expectedList13}
    ${itemList1} | ${30} | ${expectedList130}
    ${itemList1} | ${57} | ${expectedList130}
    ${itemList2} | ${0} | ${expectedList20}
    ${itemList2} | ${1} | ${expectedList21}
    ${itemList2} | ${3} | ${expectedList23}
    ${itemList2} | ${5} | ${expectedList23}
    ${itemList2} | ${30} | ${expectedList230}
    ${itemList2} | ${117} | ${expectedList230}
    ${itemList2} | ${127} | ${expectedList2127}
    ${itemList2} | ${300} | ${expectedList2127}
`("Return $expected when $numDays is entered", ({itemList, numDays, expected}) => {
expect(checkExpiring(itemList, numDays)).toStrictEqual(expected);
});

//search for items in itemList1
const expectedList1A = [ {desc:"A", flippedDate:"20072022"} ]
const expectedList1Z = []

//search for items in itemList2
const expectedList2E = [ {desc: "E", flippedDate: flipped127DaysAfter, unmaskedDate: unmaskedDate}, 
                         {desc: "E", flippedDate: flippedTheDayAfter} ]
const expectedList2L = []

//test searchFor
//searchFor takes in an array and a string and searches for a match for the string in the array
test.each`
    itemList | search  | expected
    ${itemList1} | ${'A'} | ${expectedList1A}
    ${itemList1} | ${'Z'} | ${expectedList1Z}
    ${itemList2} | ${'E'} | ${expectedList2E}
    ${itemList2} | ${'L'} | ${expectedList2L}
`("Return $expected when $search is entered", ({itemList, search, expected}) => {
expect(searchFor(itemList, search)).toStrictEqual(expected);
});
                   

//test crossCheck
const toBuyList1 = []
const toBuyList2 = [ {id: "01AHD2937420NKFDL", desc:"A"}, {desc:"B"}, {desc:"H"} ]
const toBuyList3 = [ {desc: "C"}, {desc: "E"}, {desc: "Z"} ]
const toBuyList4 = [ {desc: "H"}, {desc: "I"}, {desc: "J"} ]


const expectedL11 = []
const expectedL12 = []
const expectedL21 = [ {desc:"A", flippedDate:"20072022"}, {desc:"B", flippedDate:flipped} ]
const expectedL22 = []
const expectedL31 = [ {desc:"C", flippedDate: flipped}, {desc: "E", flippedDate: flippedTheDayAfter} ]
const expectedL32 = [ {desc:"C", flippedDate: flippedTheDayAfter}, 
                     {desc: "E", flippedDate: flipped127DaysAfter, unmaskedDate: unmaskedDate},
                     {desc: "E", flippedDate: flippedTheDayAfter} ]

const expectedL41 = []
const expectedL42 = []

//crossCheck takes in the inventoryList and the toBuyList and checks for any matches 
//in the description of each item (object) in the two arrays
//returns an array of overlapped items (with data from the inventory list)

test.each`
    itemList | toBuyList  | expected
    ${itemList1} | ${toBuyList1} | ${expectedL11}
    ${itemList2} | ${toBuyList1} | ${expectedL12}
    ${itemList1} | ${toBuyList2} | ${expectedL21}
    ${itemList2} | ${toBuyList2} | ${expectedL22}
    ${itemList1} | ${toBuyList3} | ${expectedL31}
    ${itemList2} | ${toBuyList3} | ${expectedL32}
    ${itemList1} | ${toBuyList4} | ${expectedL41}
    ${itemList2} | ${toBuyList4} | ${expectedL42}
`("Return $expected when $itemList and $toBuyList is compared", ({itemList, toBuyList, expected}) => {
expect(crossCheck(itemList, toBuyList)).toStrictEqual(expected);
});