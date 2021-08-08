const { count } = require('console');
const express = require('express')
const router = express.Router()


const db = require('../config/db')

router.post('/login', (req, res) =>
{
    const mob = req.body.mob;
    const pass = req.body.pass;

    db.query("SELECT * FROM `users` WHERE mob = ?", [mob], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            db.query("SELECT * FROM `users` WHERE mob = ? AND pass = ?", [mob, pass], (err, results) =>
            {
                if (err)
                {
                    console.log(err);
                }
                if (results.length > 0)
                {
                    res.json({ signed: true, arr: results });
                } else
                {
                    res.json({ unsigned: true, msg: 'Wrong password!.' });
                }
            })
        } else
        {
            res.json({ unsigned: true, msg: 'Mobile unmatched!.' });
        }
    })
})
router.post('/send', (req, res) =>
{
    const id = req.body.id;
    const mob = req.body.mob;
    const hash = req.body.hash;
    const date = req.body.date;
    const title = req.body.title;
    const send = req.body.sender;
    const reciev = req.body.recieve;
    const total = req.body.total;
    const files = req.body.files;

    db.query('INSERT INTO `send`(`sender`, `reciever`, `hash`, `date`, `title`, `total`) VALUES (?,?,?,?,?,?)',
        [
            mob, reciev, hash, date, title, total
        ], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            for (var i = 0; i < files.length; i++)
            {
                db.query('INSERT INTO `files`(`name`, `type`, `size`, `hash`, `file`) VALUES (?,?,?,?,?)',
                    [files[i].name, files[i].type, files[i].size, hash, files[i].uri], (err1, results1) =>
                {
                    if (err1)
                    {
                        console.log(err1)
                    }

                })
            }
            res.json({ sent: true });
        }
    })

})
router.post('/recieve', (req, res) =>
{
    const mob = req.body.mob;

    db.query('SELECT * FROM `send` WHERE reciever = ?', [mob], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            res.send(results);
        }
    })
})
router.post('/history', (req, res) =>
{
    const mob = req.body.mob;

    db.query('SELECT * FROM `send` WHERE sender = ?', [mob], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            res.send(results);
        }
    })
})
router.post('/pub_down', (req, res) =>
{
    const hash = req.body.hash;

    db.query('SELECT * FROM `send` WHERE hash = ?', [hash], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            res.send(results);
        }
    })
})
router.post('/download', (req, res) =>
{
    const hash = req.body.hash;

    db.query('SELECT * FROM `files` WHERE hash = ?', [hash], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            res.send(results);
        }
    })
})

router.post('/posts', (req, res) =>
{
    db.query('SELECT * FROM `more`', (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            res.send(results);
        }
    })
})
router.post('/read', (req, res) =>
{
    const id = req.body.id;

    db.query('UPDATE `send` SET  delivery = ? WHERE id = ?', ['yes', id], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            res.json({ read: true });
        }
    })
})
router.post('/like', (req, res) =>
{
    const id = req.body.id;
    const like = req.body.newlike;

    db.query('UPDATE `more` SET `like` = ? WHERE `id` = ?', [like, id], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            res.json({ like: true });
        }
    })
})
router.post('/saved', (req, res) =>
{
    const user = req.body.user;

    db.query('SELECT * FROM `save` WHERE user = ?', [user], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            res.send(results);
        }
    })
})
router.post('/get_rates', (req, res) =>
{
    const hash = req.body.hash;

    db.query('SELECT * FROM `rate` WHERE hash = ?', [hash], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            res.send(results);
        }
    })
})
router.post('/save', (req, res) =>
{
    const user = req.body.user;
    const hash = req.body.hash;
    db.query('SELECT * FROM `save` WHERE user = ? AND list = ?', [user, hash], (err, results) =>
    {
        if (err)
        {
            console.log(err)
        }
        if (results.length > 0)
        {
            db.query("DELETE FROM `save` WHERE user = ? AND list = ?", [user, hash], (err, results) =>
            {
                if (err)
                {
                    console.log(err)
                }
                if (results)
                {
                    res.json({ unsaved: true })
                }
            })
        } else
        {
            db.query("INSERT INTO `save`(`user`, `list`) VALUES (?,?)", [user, hash], (err, results) =>
            {
                if (err)
                {
                    console.log(err);
                }
                if (results)
                {
                    res.json({ saved: true });
                }
            })
        }
    })

})
router.post('/rate', (req, res) =>
{
    const user = req.body.user;
    const hash = req.body.hash;
    const rate = req.body.rating;
    db.query('SELECT * FROM `rate` WHERE user = ? AND hash = ?', [user, hash], (err, results) =>
    {
        if (err)
        {
            console.log(err)
        }
        if (results.length > 0)
        {
            db.query("UPDATE `rate` SET `rate`= ? WHERE user = ? AND hash = ?", [rate, user, hash], (err1, results1) =>
            {
                if (err1)
                {
                    console.log(err)
                }
                if (results1)
                {
                    res.json({ rated: true });
                }
            })
        } else
        {
            db.query("INSERT INTO `rate`(`user`, `hash`, `rate`) VALUES (?,?,?)", [user, hash, rate], (err1, results1) =>
            {
                if (err1)
                {
                    console.log(err);
                }
                if (results1)
                {
                    res.json({ rated: true });
                }
            })
        }
    })
    if (rate === 1)
    {
        db.query("UPDATE `more` SET `one`= (`one` + 1 ) WHERE `hash` = ?", [hash], (err, results) =>
        {
            if (err)
            {
                console.log(err);
            }
            if (results)
            {
                console.log('OK');
            }
        })
    }
    if (rate === 2)
    {
        db.query("UPDATE `more` SET `two`= (`two` + 1 ) WHERE `hash` = ?", [hash], (err, results) =>
        {
            if (err)
            {
                console.log(err);
            }
            if (results)
            {
                console.log('OK');
            }
        })
    }
    if (rate === 3)
    {
        db.query("UPDATE `more` SET `three`= (`three` + 1 ) WHERE `hash` = ?", [hash], (err, results) =>
        {
            if (err)
            {
                console.log(err);
            }
            if (results)
            {
                console.log('OK');
            }
        })
    }
    if (rate === 4)
    {
        db.query("UPDATE `more` SET `four`= (`four` + 1 ) WHERE `hash` = ?", [hash], (err, results) =>
        {
            if (err)
            {
                console.log(err);
            }
            if (results)
            {
                console.log('OK');
            }
        })
    }
    if (rate === 5)
    {
        db.query("UPDATE `more` SET `five`= (`five` + 1 ) WHERE `hash` = ?", [hash], (err, results) =>
        {
            if (err)
            {
                console.log(err);
            }
            if (results)
            {
                console.log('OK');
            }
        })
    }
})
router.post('/histadd', (req, res) =>
{
    const id = req.body.id;

    db.query('UPDATE `send` SET  review = ? WHERE id = ?', ['yes', id], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            res.json({ read: true });
        }
    })
})
router.post('/delete', (req, res) =>
{
    const id = req.body.hash;

    db.query('DELETE FROM `send` WHERE hash = ?', [id], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            db.query('DELETE FROM `files` WHERE hash = ?', [id], (err, results) =>
            {
                if (err)
                {
                    console.log(err);
                }
                if (results)
                {
                    res.json({ deleted: true });
                }
            })
        }
    })
})
router.post('/reg', (req, res) =>
{
    const id = req.body.id;
    const na = req.body.na;
    const mob = req.body.mob;
    const ema = req.body.ema;
    const pass = req.body.pass;
    const rec = req.body.rec;
    const hash = req.body.hash;
    db.query("SELECT * FROM `users` WHERE mob = ?", [mob], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results.length > 0)
        {
            res.json({ reg: false, msg: 'Number Already In?' });
        } else
        {
            db.query("INSERT INTO `setting`(`mob`) VALUES (?)", [mob], (err12, results12) =>
            {
                if (err12)
                {
                    console.log(err12);
                }
                if (results12)
                {
                    db.query("INSERT INTO `users`(`na`, `mob`,`ema`, `pass`, `dev`, `rec`, `hash`) VALUES (?,?,?,?,?,?,?)", [na, mob, ema, pass, id, rec, hash], (err1, results1) =>
                    {
                        if (err1)
                        {
                            console.log(err1);
                        }
                        if (results1)
                        {
                            res.json({ reg: true, mob: mob, na: na, rec: rec });
                        }
                    })
                }
            })


        }
    })
})

module.exports = router;