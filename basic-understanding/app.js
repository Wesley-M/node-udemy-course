const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Hello</title></head>');
        res.write('<body>');
        res.write('<p>Hello! What is your name?</p>');
        res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    } else if (url === '/users') {
        const lastName = fs.readFileSync('username.txt', 'utf8');

        res.write('<html>');
        res.write('<head><title>Users</title></head>');

        if (lastName !== "") {
            res.write('<body><p>Hmm, I guess your name is ' + lastName + ' then!</p></body>');
        } else {
            res.write('<body><p>Empty User</p></body>');
        }
        
        res.write('</html>');
        return res.end();
    } else if (url === '/create-user' && req.method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split('=')[1];
            fs.writeFileSync('username.txt', username);
            res.statusCode = 302;
            res.setHeader('Location', '/users');
            res.end();
        });
    }

});

server.listen(3000);