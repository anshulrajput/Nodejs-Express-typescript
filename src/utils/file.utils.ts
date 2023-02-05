import fs from 'fs';

const readCustomerData = () => {
    try {
        // Note that jsonString will be a <Buffer> since we did not specify an
        // encoding type for the file. But it'll still work because JSON.parse() will
        // use <Buffer>.toString().
        const jsonString = fs.readFileSync("./customer.json", "utf-8");
        const customer = JSON.parse(jsonString);
    }
    catch (err) {
        console.log(err);
        return;
    }
}