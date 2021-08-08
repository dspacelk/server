const { count } = require('console');
const express = require('express')
const router = express.Router()


const db = require('../config/db')
const nodemailer = require("nodemailer");


router.post('/varify_added', (req, res) =>
{

    const mob = req.body.mob;
    const vari = req.body.vari;

    db.query('SELECT * FROM `users` WHERE `vari`= ? AND `mob`= ?', [vari, mob], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            res.json({ varified: true });
        }
    })
})
router.post('/password', (req, res) =>
{
    const mob = req.body.mob;
    const pass = req.body.pass;

    db.query('UPDATE `users` SET `pass`= ? WHERE `mob` = ?', [pass, mob], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            res.json({ changed: true });
        }
    })
})
router.post('/varify', (req, res) =>
{

    const email = req.body.mail;
    const rand = req.body.rand;

    db.query('UPDATE `users` SET `vari`= ? WHERE `ema`= ?', [rand, email], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results)
        {
            main().catch(console.error);
            res.json({ sent: true });
        }
    })
    async function main()
    {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "dspace.lk",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "varification@dspace.lk", // generated ethereal user
                pass: "iamtooshort", // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Dspace Varification" <varification@dspace.lk>', // sender address
            to: email, // list of receivers
            subject: "Dspace Varification.", // Subject line
            text: "ආයුබ‌ෝවන්..Welcome..", // plain text body
            html: `<p>Please enter this code to varify your account<br></br><b>${ rand }</b></p>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }



})

router.post('/users', (req, res) =>
{

    const mob = req.body.mob;

    db.query("SELECT * FROM users WHERE mob = ?", [mob], (err, results) =>
    {
        if (err)
        {
            console.log(err)
        }
        if (results)
        {
            res.send(results);
        }
    })
})

router.post('/name', (req, res) =>
{
    const mob = req.body.mob;
    const na = req.body.na;

    db.query("SELECT * FROM `users` WHERE `mob` = ?", [mob], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results.length > 0)
        {
            db.query('UPDATE `users` SET `na`= ? WHERE `mob`= ?', [na, mob], (err1, results1) =>
            {
                if (err1)
                {
                    console.log(err1)
                }
                if (results1)
                {
                    res.json({ changed: true, name: na });
                }
            })

        } else
        {
            res.json({ changed: false });
        }
    })
})


router.post('/pic', (req, res) =>
{
    const mob = req.body.mob;
    const pic = req.body.pic;

    db.query("SELECT * FROM `users` WHERE `mob` = ?", [mob], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results.length > 0)
        {
            db.query('UPDATE `users` SET `pic`= ? WHERE `mob`= ?', [pic, mob], (err1, results1) =>
            {
                if (err1)
                {
                    console.log(err1)
                }
                if (results1)
                {
                    res.json({ changed: true, name: pic });
                }
            })

        } else
        {
            res.json({ changed: false });
        }
    })
})


router.post('/setting', (req, res) =>
{
    const mob = req.body.mob;

    db.query("SELECT * FROM `setting` WHERE `mob` = ?", [mob], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results.length > 0)
        {
            res.send(results)
        }
    })
})



router.post('/back', (req, res) =>
{
    const mob = req.body.mob;
    const pic = req.body.pic;
    const name = req.body.name;

    db.query("SELECT * FROM `setting` WHERE `mob` = ?", [mob], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results.length > 0)
        {
            db.query('UPDATE `setting` SET `ba_fi`= ?, `ba_na` = ? WHERE `mob`= ?', [pic, name, mob], (err1, results1) =>
            {
                if (err1)
                {
                    console.log(err1)
                }
                if (results1)
                {
                    res.json({ changed: true, name: pic });
                }
            })

        } else
        {
            res.json({ changed: false });
        }
    })
})



router.post('/theme', (req, res) =>
{
    const mob = req.body.mob;
    const the = req.body.theme;

    db.query("SELECT * FROM `setting` WHERE `mob` = ?", [mob], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results.length > 0)
        {
            db.query('UPDATE `setting` SET `theme`= ? WHERE `mob`= ?', [the, mob], (err1, results1) =>
            {
                if (err1)
                {
                    console.log(err1)
                }
                if (results1)
                {
                    res.json({ changed: true, name: the });
                }
            })

        } else
        {
            res.json({ changed: false });
        }
    })
})


router.post('/email', (req, res) =>
{
    const mob = req.body.mob;
    const ma = req.body.ma;

    db.query("SELECT * FROM `users` WHERE `mob` = ?", [mob], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results.length > 0)
        {
            db.query('UPDATE `users` SET `ema`= ? WHERE `mob`= ?', [ma, mob], (err1, results1) =>
            {
                if (err1)
                {
                    console.log(err1)
                }
                if (results1)
                {
                    res.json({ changed: true, name: ma });
                }
            })

        } else
        {
            res.json({ changed: false });
        }
    })
})

router.post('/mobile', (req, res) =>
{
    const mob = req.body.mob;
    const mo = req.body.mo;

    db.query("SELECT * FROM `users` WHERE `mob` = ?", [mob], (err, results) =>
    {
        if (err)
        {
            console.log(err);
        }
        if (results.length > 0)
        {
            db.query("SELECT * FROM `users` WHERE `mob` = ?", [mo], (err2, results2) =>
            {
                if (err2)
                {
                    console.log(err2);
                }
                if (results2.length < 1)
                {
                    db.query('UPDATE `users` SET `mob`= ? WHERE `mob`= ?', [mo, mob], (err1, results1) =>
                    {
                        if (err1)
                        {
                            console.log(err1)
                        }
                        if (results1)
                        {
                            res.json({ changed: true, name: mo });
                        }
                    })
                } else
                {
                    res.json({ have: true });
                }
            })


        } else
        {
            res.json({ changed: false });
        }
    })

})

module.exports = router;