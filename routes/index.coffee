express   = require('express')
_         = require('lodash')
RoomStore = require('../models/RoomStore')

router = express.Router()

roomIdRegex = '[a-zA-Z]{5}'
trackIdRegex = '[a-zA-Z0-9_]+'

roomStore = new RoomStore()

# RoomState ::
# {
#   currentTrack : TrackState
#   queue        : [TrackState]
# }

# TrackState ::
# {
#   id        : 123
#   name      : 'Yellow Submarine'
#   artist    : "The Beatles"
#   album     : "No idea"
#   thumbnail : 'http://image.url.com'
#   upvotes   : 1
#   downvotes : 2
# }

router.get '^/yo/?$', (req, res) ->
  roomStore.gotYoed()
  res.send('Cheers, yo!')

# Response :
# {
#   roomId : 'AAAAA'
# }
router.post "^/rooms/?$", (req, res) ->
  console.log "created room"
  res.send roomStore.createRoom()

# Response : RoomState
router.get "^/rooms/:id(#{roomIdRegex})/?$", (req, res) ->
  roomId = req.params.id
  try
    res.send roomStore.getRoomState(roomId)
  catch e
    res.status(404).send { error : e }

# Response : RoomState
router.post "^/rooms/:id(#{roomIdRegex})/tracks/?$", (req, res) ->
  roomId = req.params.id
  console.log (req.body)
  { id, name, artist, album, thumbnail } = req.body
  console.log ({ id, name, artist, album, thumbnail })
  if id? and name? and artist? and album? and thumbnail?
    try
      roomStore.upload(roomId, { id, name, artist, album, thumbnail })
      res.send roomStore.getRoomState(roomId)
    catch e
      res.status(404).send { error : e }
  else
    res.status(404).send { error : "Not all the data needed to upload a track was send" }

# Response : RoomState
router.post "^/rooms/:roomId(#{roomIdRegex})/tracks/:trackId(#{trackIdRegex})/upvote/?$", (req, res) ->
  roomId = req.params.roomId
  trackId = req.params.trackId
  try
    roomStore.upvoteTrack roomId, trackId
    res.send roomStore.getRoomState(roomId)
  catch e
    res.status(404).send { error : e }

# Response : RoomState
router.post "^/rooms/:roomId(#{roomIdRegex})/tracks/:trackId(#{trackIdRegex})/downvote/?$", (req, res) ->
  roomId = req.params.roomId
  trackId = req.params.trackId
  try
    roomStore.downvoteTrack roomId, trackId
    res.send roomStore.getRoomState(roomId)
  catch e
    res.status(404).send { error : e }

# Response : RoomState
router.post "^/rooms/:id(#{roomIdRegex})/playNext/?$", (req, res) ->
  roomId = req.params.id
  try
    roomStore.playNext roomId
    res.send roomStore.getRoomState(roomId)
  catch e
    res.status(404).send { error : e }

module.exports = router
