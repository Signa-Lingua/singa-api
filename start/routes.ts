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

const GithubAuthsController = () => import('#controllers/github_auths_controller')
const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')
const TestsController = () => import('#controllers/tests_controller')

// Tests Routes
router.get('/', [TestsController, 'test'])
router.post('/test', [TestsController, 'testFileUpload'])
router.delete('/test', [TestsController, 'testFileDelete'])

// Auth
router.post('/login', [AuthController, 'create'])
router.post('/register', [UsersController, 'store'])
router.post('/guest', [UsersController, 'create'])

// Github Auth
router.get('/login/github', [GithubAuthsController, 'index'])
router.get('/login/github/callback', [GithubAuthsController, 'store'])

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
    router.post('/refresh', [AuthController, 'update'])
    router.post('/logout', [AuthController, 'destroy'])

    // Users
    router.get('/users/me', [UsersController, 'index'])
    router.put('/users/me', [UsersController, 'update'])
  })
  .middleware(middleware.auth())
