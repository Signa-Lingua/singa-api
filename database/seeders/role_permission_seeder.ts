import Permission from '#models/permission'
import Role from '#models/role'
import RolePermisson from '#models/role_permisson'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method

    const roles = await Role.all()
    const permissions = await Permission.all()

    let roleList: Role[] = []
    for (const role of roles) {
      roleList.push(role)
    }

    let permissionList: Permission[] = []
    for (const permission of permissions) {
      permissionList.push(permission)
    }

    await RolePermisson.createMany([
      { roleId: roleList[1].id, permissionId: permissionList[0].id },
      { roleId: roleList[1].id, permissionId: permissionList[1].id },
      { roleId: roleList[1].id, permissionId: permissionList[2].id },
      { roleId: roleList[1].id, permissionId: permissionList[3].id },
    ])
  }
}
