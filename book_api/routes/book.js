var express = require('express');
var router = express.Router();
var book = require('../models/book_model.js');

// ADD IMAGE
var multer = require('multer');
// var upload = multer({ dest: './public/images/books/' });
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/books/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
var upload = multer({ storage: storage })

router.get('/', (req, res) => {
    const { idbook, accept } = req.query;
    book.getByIdbook( idbook, (err, dbResult) => {
        if (err) {
            res.json(err);
        } else {
            if (dbResult.length > 0) {
                if (!accept) {
                    res.render('book_detail', { book: dbResult[0]});
                } else if (accept == 'json') {
                    res.json({ success: true, totalBooks: dbResult.length, books: dbResult });
                }
                
            } else {
                res.json( {success: false, message: 'There is no book with that id.'} );
            }
        }
    });
});

router.get('/b_mb', (req, res) => { // book look up member
    const { idbook, accept } = req.query;
    book.getByIdbookLookupMemberTable( idbook, (err, dbResult) => {
        if (err) {
            res.json(err);
        } else {
            if (dbResult.length > 0) {
                if (!accept) {
                    res.render('book_detail', { book: dbResult[0]});
                } else if (accept == 'json') {
                    res.json({ success: true, totalBook_members: dbResult.length, book_members: dbResult });
                }
                
            } else {
                res.json( {success: false, message: 'There is no book with that id.'} );
            }
        }
    });
});

router.get('/upload', (req, res) => {
    const { idmember } = req.query;
    if (!idmember || isNaN(idmember) || parseInt(idmember) <= 0) {
        res.redirect('/login');
        return
    }
    book.getByIdmember( idmember, (err, dbResult) => {
        err ? res.json(err) : res.render('book_upload');
    } )
});

router.post('/upload', (req, res) => {
    book.getByIdmember( req.body.idmember, (err, dbResult) => {
        err ? res.json(err) : res.render('book_upload');
    } )
});

// (ADD IMAGE)
router.post('/add', upload.single('image'), (req, res) => {
    // console.log(req.file.path);
    // console.log(req.file);
    req.body.image = req.file.filename;
    
    if (req.body.idmember && parseInt(req.body.idmember) > 0) {
        // if ( !Number.isNaN(req.body.year) ) req.body.year = null;
        // if ( !Number.isNaN(req.body.edition) ) req.body.edition = null;

        book.add( req.body, (err, dbResult) => {
            if (err) {
                console.log(err);
                res.json( { success: false });
            } else {
                // res.json( { success: true, message: 'Book sucessfully uploaded.' } );
                res.redirect( '/book?idbook=' + dbResult.insertId );
            }    
        });
    }

    } );

router.get('/search', (req, res) => {
    const { title } = req.query;

    if (title) {
        book.searchByTitle( title, (err, dbResult) => {
            if (err) {
                console.log(err);
                res.json( { success: false });
            } else {
                res.json( { success: true, totalBooks: dbResult.length, books: dbResult } );
            }    });
        return
    }

    const { author } = req.query;
    if (author) {
        book.searchByAuthor( author, (err, dbResult) => {
            if (err) {
                console.log(err);
                res.json( { success: false });
            } else {
                res.json( { success: true, totalBooks: dbResult.length, books: dbResult } );
            }    });
        return
    }

    const { idbook } = req.query;
    if (idbook) {
        book.getByIdbook( idbook, (err, dbResult) => {
            if (err) {
                console.log(err);
                res.json( { success: false });
            } else {
                res.json( { success: true, totalBooks: dbResult.length, books: dbResult } );
            }    });
        return
    }
});

router.get('/latest', (req, res) => {
    book.getLatest( (err, dbResult) => {
        if (err) {
            console.log(err);
            res.json( { success: false });
        } else {
            res.json( { success: true, totalBooks: dbResult.length, books: dbResult } );
        }    
    });
});

router.delete('/delete', (req, res) => {
    const { idmember, idbook } = req.query;
    book.delete( idmember, idbook, (err, dbResult) => {
        if (err) {
            console.log(err);
            res.json( { success: false });
        } else {
            res.json( { success: true, deletedRows: dbResult.affectedRows } );
        }    
    });
});

// EDIT BOOK
router.get('/edit', (req, res) => {
    book.getByIdbook( req.query.idbook, (err, dbResult) => {
        if (err) {
            res.json(err);
        } else {
            res.render('book_edit', { book: dbResult[0]});
        }
    });
});

router.put('/edit', upload.single('image'), (req, res) => {
    if (req.file) {
        req.body.image = req.file.filename;
        book.update1( req.query.idbook, req.body, (err, dbResult) => {
            if (err) {
                console.log(err);
                res.json( { success: false });
            } else {
                res.json(dbResult);
            }
        });
    }
    else {
        // const {idbook} = req.query;
        book.update2( req.query.idbook, req.body, (err, dbResult) => {
            if (err) {
                console.log(err);
                res.json( { success: false });
            } else {
                // res.json( { success: true, message: 'Book sucessfully uploaded.' } );
                // res.redirect( '/book?idbook=' + dbResult.insertId );
                res.json(dbResult);
            }
        });
    }
});

module.exports = router;
