const express   = require('express');
const app       = express();
const PORT      = 3000;


app.use(express.json());


app.get('/', (req, res) => {
    const d = new Date()
    const dateTimeString = [d.getDate(),
                            d.getMonth() + 1,
                            d.getFullYear()
                        ].join('/')
                            + ' ' +
                        [
                            d.getHours(),
                            d.getMinutes(),
                            d.getSeconds()
                        ].join(':');

    console.log('request received at ' + dateTimeString);
    return res.status(200).send(
        {
            message: 'hello world'
            , rand: Math.floor(Math.random() * 1000)
        });
});


app.listen(PORT, () => {
    console.log(`Alive at http://localhost:${PORT}`)
});