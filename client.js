const axios = require('axios');


async function getData(uri) {
    return await axios.get(uri, {timeout: 5000});
}


async function wait(delay) {
    return new Promise((res, rej) => setTimeout(res, delay))
}


async function retryRequest(uri, triesToDo, waitingInterval, outData, err) {
    if (triesToDo <= 0) { // make sure we don't send requests indefinitely
        throw err;        // if number of retries of a certain request is exceeded we return an error
    }

    try {
        await wait(waitingInterval); // wait for the specified amount of time and proceed
        const result = await getData(uri);      // try reqesting again
        outData.data = result.data;     // save data
        console.log(result.data);
    } catch(err) {
        d = new Date();
        console.error('Request failed at ' + [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/')
                                         + ' '
                                         + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':'));
        await retryRequest(uri, triesToDo - 1, waitingInterval, outData, err);
    }
}


async function processData(uri, outData) {
    let res = null;
    try {
        res = await getData(uri);
        outData.data = res.data;
        console.log(res.data);
    } catch(err) {
        console.error('Initial request failed');
        try {
            await retryRequest(uri, process.env.NUM_OF_RETRIES || 10, process.env.INTERVAL || 1000, outData, err); // retries request if initial one failed
        } catch(err) {
            console.error('Max number of retries reached :-(');
        }

        return;
    }
}


async function main() {
    let outData = {data: null};
    await processData('http://localhost:3000', outData);

    setTimeout(() => console.log(outData), 20 * 1000); // make sure and show that data gets saved to the outData object
}


main();