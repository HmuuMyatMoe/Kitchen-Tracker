import { checkDate } from "../components/foodinventory/CheckExp";

let today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();

today = dd + mm + yyyy;
flipped = yyyy + mm + dd;

nextYear = String(parseInt(today) + 1);
flippedNextYear = String(parseInt(flipped) + 10000);

test.each`
    date       | expected
    ${today} | ${flipped} //valid date
    ${nextYear} | ${flippedNextYear} //valid date
    ${"20072022"} | ${false} //expired
    ${"00000000"} | ${false} //expired
`("Return $expected when $date is entered", ({date, expected}) => {
    expect(checkDate(date)).toBe(expected);
});