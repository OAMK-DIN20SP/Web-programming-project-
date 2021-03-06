const db = require('../database');

const message = {
  getByIdmember: function(idmember, callback) {
    // get all the messages that the idmember (the argument passed in) involved
    // that means he is the sender or the receiver
    return db.query(
      "select message.*, concat(member1.firstname, ' ', member1.lastname) as sender_name, concat(member2.firstname, ' ', member2.lastname) as receiver_name from message inner join `member` as member1 on member1.idmember=message.idmember inner join `member` as member2 on member2.idmember=message.idreceiver where message.idmember=? or message.idreceiver=? order by time asc",
      [idmember, idmember],
      callback
    );
  },

  getByIdmemberAndIdbook: function(idmember, idbook, callback) {
    return db.query(
      "select b.idbook, b.image as book_image, b.idmember as book_idmember, m.idmember, m.idreceiver, m.message, m.time, mb.image as member_image, concat(mb.firstname, ' ', mb.lastname) as sender_name, concat(mb2.firstname, ' ', mb2.lastname) as receiver_name from book b left join message m on b.idbook=m.idbook inner join `member` mb on mb.idmember=m.idmember inner join `member` mb2 on mb2.idmember=m.idreceiver where b.idbook=? and (m.idmember=? or m.idreceiver=?) order by time asc",
      [idbook, idmember, idmember],
      callback
    );
  },

  getByBookAndTwoPeople: function(id1, id2, idbook, time, callback) {
    // get all the messages of a specified book between 2 and only 2 specified people
    return db.query(
      "select b.idbook, b.image as book_image, b.idmember as book_idmember, m.idmember, m.idreceiver, m.message, m.time, mb.image as member_image, concat(mb.firstname, ' ', mb.lastname) as sender_name, concat(mb2.firstname, ' ', mb2.lastname) as receiver_name from book b left join message m on b.idbook=m.idbook inner join `member` mb on mb.idmember=m.idmember inner join `member` mb2 on mb2.idmember=m.idreceiver where b.idbook=? and (m.idmember=? or m.idreceiver=?) and (m.idmember=? or m.idreceiver=?) and `time`>convert_tz(?, '+00:00', @@session.time_zone) order by `time` asc",
      [idbook, id1, id1, id2, id2, time],
      callback
    );
  },

  deleteByBookAndTwoPeople: function(id1, id2, idbook, callback) {
    // delete all messages for the specified: book, person 1, person 2
    return db.query(
      "delete from message where idbook=? and (idmember=? or idreceiver=?) and (idmember=? or idreceiver=?)",
      [idbook, id1, id1, id2, id2],
      callback
    );
  },

  getByIdmemberAndTime: function(idmember, time, callback) {
    return db.query(
      "select message.*, concat(member1.firstname, ' ', member1.lastname) as sender_name, concat(member2.firstname, ' ', member2.lastname) as receiver_name from message inner join `member` as member1 on member1.idmember=message.idmember inner join `member` as member2 on member2.idmember=message.idreceiver where message.idmember=? or message.idreceiver=? and `time`>? order by `time` asc",
      [idmember, idmember, time],
      callback
    );
  },

  add: function(message, callback) {
    return db.query(
      'insert into message (idmember, idreceiver, message, idbook, time) values(?, ?, ?, ?, now())',
      [parseInt(message.idmember), parseInt(message.idreceiver), message.message, message.idbook],
      callback
    );
  }
};

module.exports = message;