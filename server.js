const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.join());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (res) => res.sendFile(path.join(__dirname, '/../public/index.html')));

app.get('/notes', (res) => res.sendFile(path.join(__dirname, '../public/notes.html')));

app.get('/api/notes', (res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf-8', (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf-8', (err, data) => {
        if (err) throw err;

        const noteList = JSON.parse(data);
        noteList.push(newNote);

        for(i = 0; i < noteList.length; i++) {
            noteList[i].id = i;
        }
        fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(noteList), (err) => {
            if (err) throw err;
        })
    });
    res.send('Note_saved');
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf-8', (err, data) => {
        if (err) throw err;
        let noteList = JSON.parse(data);
        noteList.splice(id, 1);
        for (i = 0; i < noteList.length; i++) {
            noteList[i].id = i;
        }
        fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(noteList), (err) => {
            if (err) throw err;
        })
    });
    res.send("Note_deleted");
});

app.listen(PORT, () => console.log(`APP LISTENING ON PORT ${PORT}`));