/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/
import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import responseFormatter from '#utils/response_formatter'
import { HTTP } from '#lib/constants/http'
import { apiThrottle } from '#start/limiter'

const GoogleAuthsController = () => import('#controllers/google_auths_controller')
const GithubAuthsController = () => import('#controllers/github_auths_controller')
const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')
const TestsController = () => import('#controllers/tests_controller')
const ArticleController = () => import('#controllers/articles_controller')
const ConversationNodeVideosController = () =>
  import('#controllers/conversation_node_videos_controller')
const ConversationNodeSpeechesController = () =>
  import('#controllers/conversation_node_speeches_controller')
const StaticTranslationsController = () => import('#controllers/static_translations_controller')
const ConversationTranslationsController = () =>
  import('#controllers/conversation_translations_controller')
const ConversationNodesController = () => import('#controllers/conversation_nodes_controller')
const BulkDeleteConversationNodesController = () =>
  import('#controllers/bulk_delete_conversation_nodes_controller')

// Tests Routes
router
  .get('/', ({ response }) => {
    response.ok(responseFormatter(HTTP.OK, 'success', 'Api is up and running'))
  })
  .use(apiThrottle)
router.post('/test/file', [TestsController, 'test']).use(apiThrottle)
router.post('/test', [TestsController, 'testFileUpload']).use(apiThrottle)
router.delete('/test', [TestsController, 'testFileDelete']).use(apiThrottle)
router.post('/test/gcp', [TestsController, 'testGoogleCloudStorage']).use(apiThrottle)
router.delete('/test/gcp', [TestsController, 'testGoogleCloudStorageDelete']).use(apiThrottle)
router
  .get('/test/gcp/metadata', [TestsController, 'testGoogleCloudStorageMetadata'])
  .use(apiThrottle)
router.get('/test/queue', [TestsController, 'testQueueSystem']).use(apiThrottle)

// Auth
router.post('/login', [AuthController, 'create'])
router.post('/register', [UsersController, 'store'])
router.post('/guest', [UsersController, 'create'])
router.post('/refresh', [AuthController, 'update'])

// Github Auth
router.get('/login/github', [GithubAuthsController, 'index'])
router.get('/login/github/callback', [GithubAuthsController, 'store'])

// Google Auth
router.get('/login/google', [GoogleAuthsController, 'index'])
router.get('/login/google/callback', [GoogleAuthsController, 'store'])

// Public Articles
router.get('/articles', [ArticleController, 'index'])
router.get('/articles/:id', [ArticleController, 'show'])

router.get('/uploads/article/*', async ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const absolutePath = app.makePath('uploads/article', normalizedPath)
  return response.download(absolutePath)
})

router
  .group(() => {
    // For Fetching Avatar
    router.get('/uploads/avatar/*', async ({ request, response }) => {
      const filePath = request.param('*').join(sep)
      const normalizedPath = normalize(filePath)

      if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
        return response.badRequest('Malformed path')
      }

      const absolutePath = app.makePath('uploads/avatar', normalizedPath)
      return response.download(absolutePath)
    })

    // Auth
    router.post('/logout', [AuthController, 'destroy'])

    // Users
    router.get('/users/me', [UsersController, 'index']).use(apiThrottle)
    router.get('/users/quota', [UsersController, 'quota']).use(apiThrottle)
    router.put('/users/me', [UsersController, 'update']).use(apiThrottle)

    // Static Translation Multiple
    router.get('/translation/static', [StaticTranslationsController, 'index']).use(apiThrottle)
    router.post('/translation/static', [StaticTranslationsController, 'store']).use(apiThrottle)
    // Static Translation Single
    router.get('/translation/static/:id', [StaticTranslationsController, 'show']).use(apiThrottle)
    router.put('/translation/static/:id', [StaticTranslationsController, 'update']).use(apiThrottle)
    router
      .delete('/translation/static/:id', [StaticTranslationsController, 'destroy'])
      .use(apiThrottle)

    // Conversation Translation Multiple
    router
      .get('/translation/conversation', [ConversationTranslationsController, 'index'])
      .use(apiThrottle)
    router
      .post('/translation/conversation', [ConversationTranslationsController, 'create'])
      .use(apiThrottle)
    // Conversation Translation Single
    router
      .get('/translation/conversation/:id', [ConversationNodesController, 'show'])
      .use(apiThrottle)
    router
      .post('/translation/conversation/:id/video', [ConversationNodeVideosController, 'store'])
      .use(apiThrottle)
    router
      .post('/translation/conversation/:id/speech', [ConversationNodeSpeechesController, 'store'])
      .use(apiThrottle)
    router
      .put('/translation/conversation/:id', [ConversationTranslationsController, 'update'])
      .use(apiThrottle)
    router
      .delete('/translation/conversation/:id', [ConversationTranslationsController, 'destroy'])
      .use(apiThrottle)

    // Conversation Nodes Video
    router
      .get('/translation/conversation/:conversationTranslationId/video/:transcriptId', [
        ConversationNodeVideosController,
        'show',
      ])
      .use(apiThrottle)

    // Conversation Nodes Speech
    router
      .post('/translation/conversation/node/speech', [ConversationNodeSpeechesController, 'store'])
      .use(apiThrottle)

    // Bulk Delete Conversation Nodes
    router
      .post('/translation/conversation/bulk/node', [
        BulkDeleteConversationNodesController,
        'destroy',
      ])
      .use(apiThrottle)

    // Articles
    router.post('/articles', [ArticleController, 'store'])
    router.put('/articles/:id', [ArticleController, 'update'])
    router.delete('/articles/:id', [ArticleController, 'destroy'])
  })
  .middleware([middleware.auth(), middleware.deleteOldTranslation()])
