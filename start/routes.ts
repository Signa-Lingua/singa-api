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
router.get('/', ({ response }) => {
  response.ok(responseFormatter(HTTP.OK, 'success', 'Api is up and running'))
})
router.post('/test/file', [TestsController, 'test'])
router.post('/test', [TestsController, 'testFileUpload'])
router.delete('/test', [TestsController, 'testFileDelete'])
router.post('/test/gcp', [TestsController, 'testGoogleCloudStorage'])
router.delete('/test/gcp', [TestsController, 'testGoogleCloudStorageDelete'])
router.get('/test/gcp/metadata', [TestsController, 'testGoogleCloudStorageMetadata'])
router.get('/test/queue', [TestsController, 'testQueueSystem'])

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
    router.get('/users/me', [UsersController, 'index'])
    router.get('/users/quota', [UsersController, 'quota'])
    router.put('/users/me', [UsersController, 'update'])

    // Static Translation Multiple
    router.get('/translation/static', [StaticTranslationsController, 'index'])
    router.post('/translation/static', [StaticTranslationsController, 'store'])
    // Static Translation Single
    router.get('/translation/static/:id', [StaticTranslationsController, 'show'])
    router.put('/translation/static/:id', [StaticTranslationsController, 'update'])
    router.delete('/translation/static/:id', [StaticTranslationsController, 'destroy'])

    // Conversation Translation Multiple
    router.get('/translation/conversation', [ConversationTranslationsController, 'index'])
    router.post('/translation/conversation', [ConversationTranslationsController, 'create'])
    // Conversation Translation Single
    router.get('/translation/conversation/:id', [ConversationNodesController, 'show'])
    router.post('/translation/conversation/:id/video', [ConversationNodeVideosController, 'store'])
    router.post('/translation/conversation/:id/speech', [
      ConversationNodeSpeechesController,
      'store',
    ])
    router.put('/translation/conversation/:id', [ConversationTranslationsController, 'update'])
    router.delete('/translation/conversation/:id', [ConversationTranslationsController, 'destroy'])

    // Conversation Nodes Video
    router.get('/translation/conversation/:conversationTranslationId/video/:transcriptId', [
      ConversationNodeVideosController,
      'show',
    ])

    // Conversation Nodes Speech
    router.post('/translation/conversation/node/speech', [
      ConversationNodeSpeechesController,
      'store',
    ])

    // Bulk Delete Conversation Nodes
    router.post('/translation/conversation/bulk/node', [
      BulkDeleteConversationNodesController,
      'destroy',
    ])

    // Articles
    router.post('/articles', [ArticleController, 'store'])
    router.put('/articles/:id', [ArticleController, 'update'])
    router.delete('/articles/:id', [ArticleController, 'destroy'])
  })
  .middleware([middleware.auth(), middleware.deleteOldTranslation()])
