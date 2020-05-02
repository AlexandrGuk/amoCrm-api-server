const express = require('express');
const app = express();
const axios = require('axios');

app.get('/api/contacts', async (request, response) => {
    let cookies = await auth();
    if ( cookies !== null ) {
        const query = request.query.query ? `?query=${request.query.query}` : '';
        const url = `https://antiplayerbs.amocrm.ru/private/api/v2/json/contacts${query}`;
        const headers = {Cookie: cookies.map(parseCookie).join('; ')}
        const contacts = await axios.get(url, {
            withCredentials: true,
            headers: headers
        }).then(getContactList).catch(e=>null);
        response.send(contacts);
        return;
    }
    response.send('reload page');
});

app.listen(3000, async () => {
    console.log("Server started!");
})

async function auth() {
    const url = `https://antiplayerbs.amocrm.ru/private/api/auth.php?type=json`;
    const formData = 'USER_LOGIN=alexander-v-guk@yandex.ru&USER_HASH=9185c7a54d289df1f8dcb32fc6835bfad5095a24'
    const response = await axios.post(url, formData, {withCredentials: true});
    return response ? response.headers['set-cookie'] : null;
}

function parseCookie(cookieHeader) {
    return cookieHeader.split(';')[0];
}

function getContactList(response) {
    if (response.data.response.contacts && response.status === 200) {
        return response.data.response.contacts
    }
}

function waiting(ms) {
    return new Promise(resolve => {
        (function delay() {
            setTimeout(() => {
                resolve();
            }, ms);
        })();
    });
}