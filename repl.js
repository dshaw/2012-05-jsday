/**
 * Module dependencies.
 */

var colors = require('colors')
  , net = require('net')
  , repl = require('repl')

/*!
 * dshaw jsday 2012
 */

/**
 * App
 */

module.exports = function (app, options) {
  var logger = app.logger
    , socketName = '/tmp/dshaw-repl'

  var server = net.createServer(function (socket) {
    var rs = repl.start('repl> ', socket)
      , context = rs.context

    context.app = app

    socket.on('connect', function () {
      socket.write('\n')
      socket.write(('\n Connected to '+options.id+'.').cyan)
      socket.write('\n  hint: try accessing the "app" object.'.magenta)
      socket.write('\n\n')
      rs.displayPrompt()
    })
  })

  server.listen(socketName)

  server.on('listen', function () {
    logger.log(Date.now(), 'repl started.', socketName)
  })

  logger.log('Cool REPL, bro!')
  logger.log('socat READLINE ' + socketName)

  return app
}