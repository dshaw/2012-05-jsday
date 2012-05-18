var express = require('express')
  , sio = require('socket.io')
  , RedisStore = sio.RedisStore
  , repl_ = require('./repl')

var options = require('optimist')
    .default({
      port: 8000
      , id: 'rs-0'
      , delay: 500
    }).argv
  , delay = options.delay
  , emojii = '🏄 💩 👊 📡 😍 🌙 💨 💘 👿 😱 😷 😜 👀 💀 💋 🎈 🍺 🍻 👻 🎅 💻 🏊 🍆 🍓 🍉'.split(' ')
  , max = emojii.length - 1;

var app = express.createServer(express.static(__dirname + '/.'))
  , io = app.io = sio.listen(app, { store: new RedisStore({ nodeId: function () { return options.id } }) })
  , logger = app.logger = console

app.wtf = []

app.get('/health', function(req, res){
    res.send({
        pid: process.pid,
        memory: process.memoryUsage(),
        uptime: process.uptime()
    })
})

app.on('listening', function () {
    logger.log('listening on :', app.address());
})

io.sockets.on('connection', function (socket) {
    socket.emit('nodeId', options.id)
})

app.listen(options.port);


// Realtime inspection with a REPL
if (options.repl) {
  repl_(app, options)

  app.wtfInterval = setInterval(function () {
    app.wtf && app.wtf.push(emojii[Math.round(Math.random()*max)])
  }, delay)
}
