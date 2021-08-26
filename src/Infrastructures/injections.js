/* istanbul ignore file */

// external agency
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const Jwt = require('@hapi/jwt')
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres')
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres')
const BcryptEncryptionHelper = require('./security/BcryptEncryptionHelper')
const JwtTokenManager = require('./security/JwtTokenManager')
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres')
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres')
const ReplyRepositoryPostgres = require('./repository/ReplyRepositoryPostgres')
const LikeRepositoryPostgres = require('./repository/LikeRepositoryPostgres')

// use case
const AddUserUseCase = require('../Applications/use_case/User/AddUserUseCase')
const LoginUserUseCase = require('../Applications/use_case/Authentication/LoginUserUseCase')
const RefreshAuthenticationUseCase = require('../Applications/use_case/Authentication/RefreshAuthenticationUseCase')
const LogoutUserUseCase = require('../Applications/use_case/Authentication/LogoutUserUseCase')
const AddThreadUseCase = require('../Applications/use_case/Thread/AddThreadUseCase')
const AddCommentUseCase = require('../Applications/use_case/Comment/AddCommentUseCase')
const DeleteCommentUseCase = require('../Applications/use_case/Comment/DeleteCommentUseCase')
const DetailThreadUseCase = require('../Applications/use_case/Thread/DetailThreadUseCase')
const AddReplyUseCase = require('../Applications/use_case/Reply/AddReplyUseCase')
const DeleteReplyUseCase = require('../Applications/use_case/Reply/DeleteReplyUseCase')
const LikeCommentUseCase = require('../Applications/use_case/Like/LikeCommentUseCase')

const serviceInstanceContainer = {
  userRepository: new UserRepositoryPostgres(pool, nanoid),
  authenticationRepository: new AuthenticationRepositoryPostgres(pool),
  encryptionHelper: new BcryptEncryptionHelper(bcrypt),
  authenticationTokenManager: new JwtTokenManager(Jwt.token),
  threadRepository: new ThreadRepositoryPostgres(pool, nanoid),
  commentRepository: new CommentRepositoryPostgres(pool, nanoid),
  replyRepository: new ReplyRepositoryPostgres(pool, nanoid),
  likeRepository: new LikeRepositoryPostgres(pool, nanoid),
}

const useCaseInstanceContainer = {
  addUserUseCase: new AddUserUseCase({
    userRepository: serviceInstanceContainer.userRepository,
    encryptionHelper: serviceInstanceContainer.encryptionHelper,
  }),
  loginUserUseCase: new LoginUserUseCase({
    authenticationRepository: serviceInstanceContainer.authenticationRepository,
    authenticationTokenManager:
      serviceInstanceContainer.authenticationTokenManager,
    userRepository: serviceInstanceContainer.userRepository,
    encryptionHelper: serviceInstanceContainer.encryptionHelper,
  }),
  refreshAuthenticationUseCase: new RefreshAuthenticationUseCase({
    authenticationRepository: serviceInstanceContainer.authenticationRepository,
    authenticationTokenManager:
      serviceInstanceContainer.authenticationTokenManager,
  }),
  logoutUserUseCase: new LogoutUserUseCase({
    authenticationRepository: serviceInstanceContainer.authenticationRepository,
  }),
  addThreadUseCase: new AddThreadUseCase({
    threadRepository: serviceInstanceContainer.threadRepository,
  }),
  addCommentUseCase: new AddCommentUseCase({
    commentRepository: serviceInstanceContainer.commentRepository,
    threadRepository: serviceInstanceContainer.threadRepository,
  }),
  deleteCommentUseCase: new DeleteCommentUseCase({
    commentRepository: serviceInstanceContainer.commentRepository,
    threadRepository: serviceInstanceContainer.threadRepository,
  }),
  detailThreadUseCase: new DetailThreadUseCase({
    threadRepository: serviceInstanceContainer.threadRepository,
    commentRepository: serviceInstanceContainer.commentRepository,
    replyRepository: serviceInstanceContainer.replyRepository,
    likeRepository: serviceInstanceContainer.likeRepository,
  }),
  addReplyUseCase: new AddReplyUseCase({
    commentRepository: serviceInstanceContainer.commentRepository,
    threadRepository: serviceInstanceContainer.threadRepository,
    replyRepository: serviceInstanceContainer.replyRepository,
  }),
  deleteReplyUseCase: new DeleteReplyUseCase({
    commentRepository: serviceInstanceContainer.commentRepository,
    threadRepository: serviceInstanceContainer.threadRepository,
    replyRepository: serviceInstanceContainer.replyRepository,
  }),
  likeCommentUseCase: new LikeCommentUseCase({
    commentRepository: serviceInstanceContainer.commentRepository,
    threadRepository: serviceInstanceContainer.threadRepository,
    likeRepository: serviceInstanceContainer.likeRepository,
  }),
}

// export all instance
module.exports = {
  ...serviceInstanceContainer,
  ...useCaseInstanceContainer,
}
