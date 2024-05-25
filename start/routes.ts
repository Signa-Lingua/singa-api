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

const StaticTranslationsController = () => import('#controllers/static_translations_controller')

// Tests Routes
router.get('/', ({ response }) => {
  response.ok(responseFormatter(HTTP.OK, 'success', 'Api is up and running'))
})
router.post('/test/file', [TestsController, 'test'])
router.post('/test', [TestsController, 'testFileUpload'])
router.delete('/test', [TestsController, 'testFileDelete'])
router.post('/test/gcp', [TestsController, 'testGoogleCloudStorage'])
router.delete('/test/gcp', [TestsController, 'testGoogleCloudStorageDelete'])

router
  .group(() => {
    // Multiple
    router.get('/translation/static', [StaticTranslationsController, 'index'])
    router.post('/translation/static', [StaticTranslationsController, 'store'])
    // Single
    router.get('/translation/static/:id', [StaticTranslationsController, 'show'])
    router.patch('/translation/static/:id', [StaticTranslationsController, 'update'])
    router.delete('/translation/static/:id', [StaticTranslationsController, 'destroy'])
  })
  .use(middleware.auth())

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
    router.put('/users/me', [UsersController, 'update'])
  })
  .middleware(middleware.auth())
